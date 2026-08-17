import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { routeParam } from "../utils/request.js";
import { createAuditLog } from "../services/audit.service.js";
import { createNotification } from "../services/notification.service.js";

const money = (pence?: number | null) => pence == null ? null : Number((pence / 100).toFixed(2));
const startOfDay = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const daysAgo = (n:number) => { const d = new Date(); d.setDate(d.getDate()-n); return d; };
const validTeamStages = ["NEW_LEAD","CONTACTED","REQUIREMENTS","QUOTE_PREPARATION","QUOTE_SENT","APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED","CANCELLED"];
const validKitStages = ["NEW","DESIGN_REVIEW","AWAITING_ASSETS","REVISION","REQUIREMENTS_CONFIRMED","QUOTED","APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED","CANCELLED"];

async function upsertSetting(key:string, value:unknown){ return prisma.storeSetting.upsert({ where:{key}, update:{value:value as any}, create:{key,value:value as any} }); }

export const adminV2Controller = {
  search: async (req:Request,res:Response) => {
    const q=typeof req.query.q==="string"?req.query.q.trim().slice(0,120):"";
    if(q.length<2)return res.json({query:q,groups:{products:[],orders:[],teamOrders:[],customKits:[],customers:[],quotes:[]}});
    const [products,orders,teamOrders,customKits,customers,quotes]=await Promise.all([
      prisma.product.findMany({take:6,where:{OR:[{name:{contains:q}},{sku:{contains:q}},{slug:{contains:q}}]},select:{id:true,name:true,slug:true,sku:true,imageUrl:true,status:true}}),
      prisma.order.findMany({take:6,where:{OR:[{orderNumber:{contains:q}},{customerName:{contains:q}},{email:{contains:q}},{phone:{contains:q}}]},select:{id:true,orderNumber:true,customerName:true,status:true,createdAt:true}}),
      prisma.teamOrderRequest.findMany({take:6,where:{OR:[{requestNumber:{contains:q}},{organisation:{contains:q}},{contactName:{contains:q}},{email:{contains:q}}]},select:{id:true,requestNumber:true,organisation:true,contactName:true,stage:true}}),
      prisma.customKitRequest.findMany({take:6,where:{OR:[{requestNumber:{contains:q}},{teamName:{contains:q}},{playerName:{contains:q}}]},select:{id:true,requestNumber:true,teamName:true,stage:true}}),
      prisma.user.findMany({take:6,where:{role:"CUSTOMER",OR:[{name:{contains:q}},{email:{contains:q}},{phone:{contains:q}}]},select:{id:true,name:true,email:true,phone:true}}),
      prisma.quote.findMany({take:6,where:{OR:[{quoteNumber:{contains:q}},{customerName:{contains:q}},{email:{contains:q}}]},select:{id:true,quoteNumber:true,customerName:true,status:true,totalPence:true}}),
    ]);
    res.set("Cache-Control","no-store, private").json({query:q,groups:{products,orders,teamOrders,customKits,customers,quotes}});
  },
  dashboard: async (_req:Request,res:Response) => {
    const [activeProducts, openTeam, openKits, pendingQuotes, lowStock, ordersToday, recentOrders, teamOrders, customKits, quotes, topProducts] = await Promise.all([
      prisma.product.count({where:{status:"ACTIVE"}}),
      prisma.teamOrderRequest.count({where:{stage:{notIn:["COMPLETED","CANCELLED"]}}}),
      prisma.customKitRequest.count({where:{stage:{notIn:["COMPLETED","CANCELLED"]}}}),
      prisma.quote.count({where:{status:{in:["DRAFT","SENT","AWAITING_RESPONSE"]}}}),
      prisma.product.count({where:{status:"ACTIVE",stockQuantity:{lte:10}}}),
      prisma.order.count({where:{createdAt:{gte:startOfDay()}}}),
      prisma.order.findMany({take:6,orderBy:{createdAt:"desc"},include:{items:true}}),
      prisma.teamOrderRequest.findMany({take:5,orderBy:{updatedAt:"desc"}}),
      prisma.customKitRequest.findMany({take:5,orderBy:{updatedAt:"desc"},include:{user:{select:{name:true,email:true}}}}),
      prisma.quote.findMany({take:5,orderBy:{updatedAt:"desc"}}),
      prisma.product.findMany({take:5,where:{status:"ACTIVE"},orderBy:[{enquiryCount:"desc"},{viewCount:"desc"}],select:{id:true,name:true,slug:true,imageUrl:true,viewCount:true,enquiryCount:true,teamRequestCount:true}})
    ]);
    const teamGrouped = await prisma.teamOrderRequest.groupBy({by:["stage"],_count:{stage:true}});
    const kitGrouped = await prisma.customKitRequest.groupBy({by:["stage"],_count:{stage:true}});
    const missingImages = await prisma.product.count({where:{OR:[{imageUrl:""},{images:{none:{}}}]}});
    res.json({
      metrics:{activeProducts,openRequests:openTeam+openKits,teamOrders:openTeam,customKits:openKits,pendingQuotes,lowStock,ordersToday},
      pipeline:{team:Object.fromEntries(teamGrouped.map(x=>[x.stage,x._count.stage])),kits:Object.fromEntries(kitGrouped.map(x=>[x.stage,x._count.stage]))},
      actionCentre:{missingImages,lowStock,pendingQuotes,unassignedTeamOrders:await prisma.teamOrderRequest.count({where:{assignedAdminId:null,stage:{notIn:["COMPLETED","CANCELLED"]}}})},
      recentOrders,teamOrders,customKits,quotes,topProducts
    });
  },

  collections: async (_req:Request,res:Response) => res.json({collections:await prisma.collection.findMany({take:100,include:{products:{include:{product:{select:{id:true,name:true,slug:true,imageUrl:true,status:true}}}},_count:{select:{products:true}}},orderBy:[{sortOrder:"asc"},{updatedAt:"desc"}]})}),
  createCollection: async (req:Request,res:Response) => {
    const {productIds=[], ...data}=req.body; const collection=await prisma.collection.create({data:{...data,products:{create:productIds.map((productId:string,index:number)=>({productId,sortOrder:index}))}},include:{products:true}}); await createAuditLog(req,"CREATE","Collection",collection.id,`Created collection ${collection.name}`); res.status(201).json({collection});
  },
  updateCollection: async (req:Request,res:Response) => {
    const {productIds, ...data}=req.body; const collection=await prisma.$transaction(async tx=>{await tx.collection.update({where:{id:routeParam(req,"id")},data}); if(Array.isArray(productIds)){await tx.collectionProduct.deleteMany({where:{collectionId:routeParam(req,"id")}}); if(productIds.length) await tx.collectionProduct.createMany({data:productIds.map((productId:string,index:number)=>({collectionId:routeParam(req,"id"),productId,sortOrder:index}))});} return tx.collection.findUniqueOrThrow({where:{id:routeParam(req,"id")},include:{products:true}})}); await createAuditLog(req,"UPDATE","Collection",collection.id,`Updated collection ${collection.name}`); res.json({collection});
  },
  deleteCollection: async (req:Request,res:Response)=>{await prisma.collection.delete({where:{id:routeParam(req,"id")}});await createAuditLog(req,"DELETE","Collection",routeParam(req,"id"),"Deleted collection");res.status(204).end();},

  inventory: async (_req:Request,res:Response) => {
    const products=await prisma.product.findMany({where:{status:{not:"ARCHIVED"}},include:{category:true},orderBy:{name:"asc"},take:250});
    const recent=await prisma.inventoryTransaction.findMany({take:30,orderBy:{createdAt:"desc"},include:{product:{select:{name:true,sku:true}}}});
    const q=(p:any)=>p.stockQuantity??0;
    res.json({metrics:{total:products.length,inStock:products.filter(p=>q(p)>20).length,low:products.filter(p=>q(p)>5&&q(p)<=20).length,critical:products.filter(p=>q(p)>0&&q(p)<=5).length,out:products.filter(p=>q(p)===0).length},products,recent});
  },
  adjustInventory: async (req:Request,res:Response)=>{
    const product=await prisma.product.findUnique({where:{id:routeParam(req,"id")}}); if(!product) throw new HttpError(404,"PRODUCT_NOT_FOUND","Product not found."); const oldQuantity=product.stockQuantity??0; const newQuantity=req.body.newQuantity; const updated=await prisma.$transaction(async tx=>{const p=await tx.product.update({where:{id:product.id},data:{stockQuantity:newQuantity}}); await tx.inventoryTransaction.create({data:{productId:p.id,oldQuantity,changeQuantity:newQuantity-oldQuantity,newQuantity,reason:req.body.reason,note:req.body.note,performedById:req.authUser?.id,performedBy:req.authUser?.email}}); return p;}); await createAuditLog(req,"STOCK_CHANGE","Product",product.id,`Stock changed ${oldQuantity} → ${newQuantity}`,{reason:req.body.reason}); if(newQuantity<=updated.lowStockThreshold) await createNotification({type:"LOW_STOCK",title:"Low stock alert",message:`${updated.name} now has ${newQuantity} units remaining.`,entityType:"Product",entityId:updated.id}); res.json({product:updated});
  },

  orderDetail: async (req:Request,res:Response)=>{const order=await prisma.order.findUnique({where:{id:routeParam(req,"id")},include:{items:true,user:{select:{id:true,name:true,email:true,phone:true}}}});if(!order) throw new HttpError(404,"ORDER_NOT_FOUND","Order not found.");res.json({order});},

  createTeamOrder: async(req:Request,res:Response)=>{const request=await prisma.teamOrderRequest.create({data:{...req.body,deadline:req.body.deadline?new Date(req.body.deadline):null,requestNumber:`TEAM-${Date.now().toString().slice(-8)}`}});await createAuditLog(req,"CREATE","TeamOrderRequest",request.id,`Created ${request.requestNumber} for ${request.organisation}`);await createNotification({type:"TEAM_ORDER",title:"Team order created",message:`${request.organisation} • ${request.requestNumber}`,entityType:"TeamOrderRequest",entityId:request.id});res.status(201).json({request});},
  teamOrderDetail: async (req:Request,res:Response)=>{const request=await prisma.teamOrderRequest.findUnique({where:{id:routeParam(req,"id")},include:{notes:{orderBy:{createdAt:"desc"}}}});if(!request) throw new HttpError(404,"REQUEST_NOT_FOUND","Team order not found.");res.json({request});},
  updateTeamStage: async (req:Request,res:Response)=>{if(!validTeamStages.includes(req.body.stage)) throw new HttpError(400,"INVALID_STAGE","Invalid team order stage.");const r=await prisma.teamOrderRequest.update({where:{id:routeParam(req,"id")},data:{stage:req.body.stage,lastContactAt:new Date()}});await createAuditLog(req,"STATUS_CHANGE","TeamOrderRequest",r.id,`Team order moved to ${r.stage}`);res.json({request:r});},
  addTeamNote: async (req:Request,res:Response)=>{const n=await prisma.teamOrderNote.create({data:{requestId:routeParam(req,"id"),note:req.body.note,authorId:req.authUser?.id,authorName:req.authUser?.name}});await createAuditLog(req,"NOTE","TeamOrderRequest",routeParam(req,"id"),"Added team order note");res.status(201).json({note:n});},

  createCustomKit: async(req:Request,res:Response)=>{const request=await prisma.customKitRequest.create({data:{...req.body,requestNumber:`KIT-${Date.now().toString().slice(-8)}`}});await createAuditLog(req,"CREATE","CustomKitRequest",request.id,`Created ${request.requestNumber}`);await createNotification({type:"CUSTOM_KIT",title:"Custom kit request created",message:`${request.teamName||"Custom Kit"} • ${request.requestNumber}`,entityType:"CustomKitRequest",entityId:request.id});res.status(201).json({request});},
  customKitDetail: async (req:Request,res:Response)=>{const request=await prisma.customKitRequest.findUnique({where:{id:routeParam(req,"id")},include:{assets:true,revisions:{orderBy:{version:"desc"}},user:{select:{id:true,name:true,email:true,phone:true}}}});if(!request) throw new HttpError(404,"REQUEST_NOT_FOUND","Custom kit request not found.");res.json({request});},
  addCustomKitAsset: async(req:Request,res:Response)=>{const parent=await prisma.customKitRequest.findUnique({where:{id:routeParam(req,"id")}});if(!parent)throw new HttpError(404,"REQUEST_NOT_FOUND","Custom kit request not found.");const asset=await prisma.customKitAsset.create({data:{requestId:parent.id,...req.body}});await createAuditLog(req,"CREATE","CustomKitAsset",asset.id,`Added ${asset.type} asset to ${parent.requestNumber}`);res.status(201).json({asset});},
  deleteCustomKitAsset: async(req:Request,res:Response)=>{const asset=await prisma.customKitAsset.findUnique({where:{id:routeParam(req,"assetId")}});if(!asset||asset.requestId!==routeParam(req,"id"))throw new HttpError(404,"ASSET_NOT_FOUND","Custom kit asset not found.");await prisma.customKitAsset.delete({where:{id:asset.id}});await createAuditLog(req,"DELETE","CustomKitAsset",asset.id,"Removed custom kit asset");res.status(204).end();},
  addCustomKitRevision: async(req:Request,res:Response)=>{const parent=await prisma.customKitRequest.findUnique({where:{id:routeParam(req,"id")}});if(!parent)throw new HttpError(404,"REQUEST_NOT_FOUND","Custom kit request not found.");const latest=await prisma.customKitRevision.aggregate({where:{requestId:parent.id},_max:{version:true}});const revision=await prisma.customKitRevision.create({data:{requestId:parent.id,version:(latest._max.version||0)+1,previewUrl:req.body.previewUrl,status:req.body.status,notes:req.body.notes||null,uploadedBy:req.authUser?.email}});await createAuditLog(req,"CREATE","CustomKitRevision",revision.id,`Added design revision ${revision.version} to ${parent.requestNumber}`);res.status(201).json({revision});},
  updateKitStage: async (req:Request,res:Response)=>{if(!validKitStages.includes(req.body.stage)) throw new HttpError(400,"INVALID_STAGE","Invalid custom kit stage.");const r=await prisma.customKitRequest.update({where:{id:routeParam(req,"id")},data:{stage:req.body.stage}});await createAuditLog(req,"STATUS_CHANGE","CustomKitRequest",r.id,`Custom kit moved to ${r.stage}`);res.json({request:r});},

  quotes: async (_req:Request,res:Response)=>res.json({quotes:await prisma.quote.findMany({include:{items:true},orderBy:{updatedAt:"desc"},take:200})}),
  quoteDetail: async(req:Request,res:Response)=>{const quote=await prisma.quote.findUnique({where:{id:routeParam(req,"id")},include:{items:true}});if(!quote) throw new HttpError(404,"QUOTE_NOT_FOUND","Quote not found.");res.json({quote});},
  createQuote: async(req:Request,res:Response)=>{const {items,...data}=req.body;const subtotal=items.reduce((s:number,i:any)=>s+i.quantity*i.unitPence,0);const quote=await prisma.quote.create({data:{...data,validUntil:data.validUntil?new Date(data.validUntil):null,subtotalPence:subtotal,totalPence:Math.max(0,subtotal-data.discountPence+data.deliveryPence),quoteNumber:`XLQ-${Date.now().toString().slice(-8)}`,createdById:req.authUser?.id,items:{create:items.map((i:any)=>({...i,totalPence:i.quantity*i.unitPence}))}},include:{items:true}});await createAuditLog(req,"CREATE","Quote",quote.id,`Created quote ${quote.quoteNumber}`);res.status(201).json({quote});},
  updateQuoteStatus: async(req:Request,res:Response)=>{const status=String(req.body.status||"");const data:any={status};if(status==="SENT")data.sentAt=new Date();if(status==="APPROVED")data.approvedAt=new Date();const quote=await prisma.quote.update({where:{id:routeParam(req,"id")},data});await createAuditLog(req,"STATUS_CHANGE","Quote",quote.id,`Quote ${quote.quoteNumber} → ${status}`);res.json({quote});},

  customers: async (_req:Request,res:Response)=>{const users=await prisma.user.findMany({where:{role:"CUSTOMER"},include:{_count:{select:{orders:true,customKitRequests:true}},orders:{select:{createdAt:true},orderBy:{createdAt:"desc"},take:1}},orderBy:{createdAt:"desc"},take:200});res.json({customers:users.map(u=>({id:u.id,name:u.name,email:u.email,phone:u.phone,createdAt:u.createdAt,ordersCount:u._count.orders,customKitCount:u._count.customKitRequests,lastActivity:u.orders[0]?.createdAt||u.createdAt}))});},
  customerDetail: async(req:Request,res:Response)=>{const user=await prisma.user.findUnique({where:{id:routeParam(req,"id")},include:{addresses:true,orders:{include:{items:true},orderBy:{createdAt:"desc"}},customKitRequests:{orderBy:{createdAt:"desc"}},customerNotes:{orderBy:{createdAt:"desc"}}}});if(!user)throw new HttpError(404,"CUSTOMER_NOT_FOUND","Customer not found.");res.json({customer:{...user,passwordHash:undefined}});},
  addCustomerNote: async(req:Request,res:Response)=>{const note=await prisma.customerNote.create({data:{userId:routeParam(req,"id"),note:req.body.note,authorId:req.authUser?.id,authorName:req.authUser?.name}});await createAuditLog(req,"NOTE","User",routeParam(req,"id"),"Added customer note");res.status(201).json({note});},

  teamAccounts: async(_req:Request,res:Response)=>res.json({accounts:await prisma.teamAccount.findMany({orderBy:{updatedAt:"desc"},take:100})}),
  createTeamAccount: async(req:Request,res:Response)=>{const a=await prisma.teamAccount.create({data:req.body});await createAuditLog(req,"CREATE","TeamAccount",a.id,`Created team account ${a.organisation}`);res.status(201).json({account:a});},
  updateTeamAccount: async(req:Request,res:Response)=>{const a=await prisma.teamAccount.update({where:{id:routeParam(req,"id")},data:req.body});await createAuditLog(req,"UPDATE","TeamAccount",a.id,`Updated team account ${a.organisation}`);res.json({account:a});},

  banner: async(_req:Request,res:Response)=>{const banner=await prisma.announcementBanner.upsert({where:{name:"primary"},update:{},create:{name:"primary"}});res.json({banner});},
  updateBanner: async(req:Request,res:Response)=>{const data={...req.body,startAt:req.body.startAt?new Date(req.body.startAt):null,endAt:req.body.endAt?new Date(req.body.endAt):null};const banner=await prisma.announcementBanner.upsert({where:{name:"primary"},update:data,create:{name:"primary",...data}});await createAuditLog(req,"UPDATE","AnnouncementBanner",banner.id,"Updated storefront announcement banner");res.json({banner});},

  campaigns: async(_req:Request,res:Response)=>res.json({campaigns:await prisma.campaign.findMany({orderBy:{updatedAt:"desc"},take:50})}),
  createCampaign: async(req:Request,res:Response)=>{const data={...req.body,startsAt:req.body.startsAt?new Date(req.body.startsAt):null,endsAt:req.body.endsAt?new Date(req.body.endsAt):null};const c=await prisma.campaign.create({data});await createAuditLog(req,"CREATE","Campaign",c.id,`Created campaign ${c.name}`);res.status(201).json({campaign:c});},
  updateCampaign: async(req:Request,res:Response)=>{const data={...req.body,startsAt:req.body.startsAt?new Date(req.body.startsAt):null,endsAt:req.body.endsAt?new Date(req.body.endsAt):null};const c=await prisma.campaign.update({where:{id:routeParam(req,"id")},data});await createAuditLog(req,"UPDATE","Campaign",c.id,`Updated campaign ${c.name}`);res.json({campaign:c});},

  analyticsPerformance: async(req:Request,res:Response)=>{const days=Math.min(365,Math.max(1,Number(req.query.days||30)));const since=daysAgo(days);const [orders,team,kits,quotes]=await Promise.all([prisma.order.findMany({where:{createdAt:{gte:since}},select:{createdAt:true,status:true}}),prisma.teamOrderRequest.findMany({where:{createdAt:{gte:since}},select:{createdAt:true,stage:true}}),prisma.customKitRequest.findMany({where:{createdAt:{gte:since}},select:{createdAt:true,stage:true}}),prisma.quote.findMany({where:{createdAt:{gte:since}},select:{createdAt:true,status:true}})]);const approvedQuotes=quotes.filter(q=>q.status==="APPROVED").length;res.json({rangeDays:days,summary:{orders:orders.length,teamOrders:team.length,customKits:kits.length,quotes:quotes.length,quoteConversion:quotes.length?Math.round(approvedQuotes/quotes.length*1000)/10:0},funnel:{requests:team.length+kits.length,qualified:team.filter(x=>x.stage!=="NEW_LEAD").length+kits.filter(x=>x.stage!=="NEW").length,quoted:team.filter(x=>["QUOTE_SENT","APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED"].includes(x.stage)).length+kits.filter(x=>["QUOTED","APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED"].includes(x.stage)).length,approved:team.filter(x=>["APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED"].includes(x.stage)).length+kits.filter(x=>["APPROVED","PRODUCTION","QUALITY_CHECK","DISPATCHED","COMPLETED"].includes(x.stage)).length,completed:team.filter(x=>x.stage==="COMPLETED").length+kits.filter(x=>x.stage==="COMPLETED").length}});},
  analyticsProducts: async(_req:Request,res:Response)=>res.json({products:await prisma.product.findMany({where:{status:{not:"ARCHIVED"}},select:{id:true,name:true,slug:true,imageUrl:true,viewCount:true,enquiryCount:true,cartAddCount:true,teamRequestCount:true,stockQuantity:true,lowStockThreshold:true,category:{select:{name:true}}},orderBy:{viewCount:"desc"},take:150})}),
  analyticsRequests: async(_req:Request,res:Response)=>{const [team,kits]=await Promise.all([prisma.teamOrderRequest.findMany({select:{sport:true,numberOfPlayers:true,createdAt:true,updatedAt:true,stage:true},take:500}),prisma.customKitRequest.findMany({select:{sport:true,primaryColor:true,createdAt:true,updatedAt:true,stage:true},take:500})]);const counts=(arr:string[])=>Object.entries(arr.reduce((a:any,v)=>(a[v]=(a[v]||0)+1,a),{})).sort((a:any,b:any)=>b[1]-a[1]);res.json({topSports:counts([...team.map(x=>x.sport),...kits.map(x=>x.sport)]).slice(0,8),topKitColours:counts(kits.map(x=>x.primaryColor)).slice(0,8),teamSizes:{small:team.filter(x=>(x.numberOfPlayers||0)<=15).length,medium:team.filter(x=>(x.numberOfPlayers||0)>15&&(x.numberOfPlayers||0)<=30).length,large:team.filter(x=>(x.numberOfPlayers||0)>30).length}});},

  notifications: async(_req:Request,res:Response)=>res.json({notifications:await prisma.notification.findMany({take:100,orderBy:{createdAt:"desc"}}),unread:await prisma.notification.count({where:{isRead:false}})}),
  updateNotification: async(req:Request,res:Response)=>res.json({notification:await prisma.notification.update({where:{id:routeParam(req,"id")},data:{isRead:req.body.isRead}})}),
  markAllNotifications: async(_req:Request,res:Response)=>{await prisma.notification.updateMany({where:{isRead:false},data:{isRead:true}});res.status(204).end();},

  auditLogs: async(req:Request,res:Response)=>{const q=typeof req.query.q==="string"?req.query.q:undefined;const action=typeof req.query.action==="string"?req.query.action:undefined;const entityType=typeof req.query.entityType==="string"?req.query.entityType:undefined;const logs=await prisma.auditLog.findMany({take:250,where:{...(action?{action}:{}),...(entityType?{entityType}:{}),...(q?{OR:[{description:{contains:q}},{action:{contains:q}},{entityType:{contains:q}}]}:{})},include:{user:{select:{name:true,email:true}}},orderBy:{createdAt:"desc"}});res.json({logs});},

  roles: async(_req:Request,res:Response)=>res.json({roles:await prisma.adminRole.findMany({include:{permissions:{include:{permission:true}},_count:{select:{memberships:true}}},orderBy:{name:"asc"},take:50})}),
  adminUsers: async(_req:Request,res:Response)=>res.json({admins:await prisma.user.findMany({where:{role:"ADMIN"},select:{id:true,name:true,email:true,phone:true,createdAt:true,adminMembership:{include:{role:true}}},orderBy:{createdAt:"asc"},take:100})}),
  createAdminUser: async(req:Request,res:Response)=>{const existing=await prisma.user.findUnique({where:{email:req.body.email}});if(existing)throw new HttpError(409,"EMAIL_EXISTS","An account already exists for this email.");const role=await prisma.adminRole.findUnique({where:{key:req.body.roleKey}});if(!role)throw new HttpError(404,"ROLE_NOT_FOUND","Admin role not found.");const passwordHash=await bcrypt.hash(req.body.password,12);const admin=await prisma.user.create({data:{name:req.body.name,email:req.body.email,phone:req.body.phone||null,passwordHash,role:"ADMIN",adminMembership:{create:{roleId:role.id,isActive:true}}},select:{id:true,name:true,email:true,phone:true,role:true,createdAt:true,adminMembership:{include:{role:true}}}});await createAuditLog(req,"CREATE","AdminUser",admin.id,`Created admin ${admin.email} with ${role.name} access`);res.status(201).json({admin});},
  updateAdminMembership: async(req:Request,res:Response)=>{const role=await prisma.adminRole.findUnique({where:{key:req.body.roleKey}});if(!role)throw new HttpError(404,"ROLE_NOT_FOUND","Admin role not found.");const membership=await prisma.adminMembership.upsert({where:{userId:routeParam(req,"id")},update:{roleId:role.id,isActive:req.body.isActive??true},create:{userId:routeParam(req,"id"),roleId:role.id,isActive:req.body.isActive??true}});await createAuditLog(req,"UPDATE","AdminMembership",membership.id,`Updated admin role to ${role.name}`);res.json({membership});},

  settings: async(_req:Request,res:Response)=>{const rows=await prisma.storeSetting.findMany({take:100});res.json({settings:Object.fromEntries(rows.map(r=>[r.key,r.value]))});},
  updateSettings: async(req:Request,res:Response)=>{for(const [key,value] of Object.entries(req.body))await upsertSetting(key,value);await createAuditLog(req,"UPDATE","StoreSetting",undefined,"Updated store settings",{keys:Object.keys(req.body)});res.json({settings:req.body});},

  media: async(req:Request,res:Response)=>{const folder=typeof req.query.folder==="string"?req.query.folder:undefined;res.json({assets:await prisma.mediaAsset.findMany({where:folder?{folder}:undefined,orderBy:{createdAt:"desc"},take:300})});},
  createMedia: async(req:Request,res:Response)=>{const asset=await prisma.mediaAsset.create({data:req.body});await createAuditLog(req,"CREATE","MediaAsset",asset.id,`Added media ${asset.fileName}`);res.status(201).json({asset});},
  deleteMedia: async(req:Request,res:Response)=>{await prisma.mediaAsset.delete({where:{id:routeParam(req,"id")}});await createAuditLog(req,"DELETE","MediaAsset",routeParam(req,"id"),"Deleted media asset");res.status(204).end();},
};
