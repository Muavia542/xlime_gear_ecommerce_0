import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";

const url = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { slug: "sports", name: "Sports", description: "Custom team uniforms, matchwear and training apparel for clubs, schools and teams.", sortOrder: 1, imageUrl: "/images/official/07_white_green_basketball_kit.jpg", subcategories: ["Football Kits","Basketball","Volleyball","Baseball","Rugby","Training Wear","Goalkeeper"] },
  { slug: "gym-active", name: "Gym & Active", description: "Performance activewear including sports leggings, sports bras, training tops and gymwear.", sortOrder: 2, imageUrl: "/images/official/09_black_tracksuit_premium_quality.jpg", subcategories: ["Sports Leggings","Sports Bras","Gymwear","Activewear"] },
  { slug: "leather", name: "Leather", description: "Premium leather jackets, wallets, belts and travel bags.", sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85", subcategories: ["Jackets","Wallets","Belts","Bags"] },
  { slug: "fashion", name: "Fashion", description: "Off-pitch clothing including hoodies, tees, joggers, tracksuits and caps.", sortOrder: 4, imageUrl: "/images/official/05_custom_clothing_black_tees.jpg", subcategories: ["Hoodies","T-Shirts","Joggers","Tracksuits","Caps","Custom Clothing"] }
];

const products = [
["xlime-football-custom-kit","XLIME Football Custom Kit","Sports","Football Kits","/images/official/11_black_green_custom_kit.jpg",true,true,"Football"],
["xlime-black-white-football-kit","XLIME Black & White Football Kit","Sports","Football Kits","/images/official/03_black_white_football_kit.jpg",true,true,"Football"],
["xlime-basketball-uniform","XLIME Basketball Uniform","Sports","Basketball","/images/official/07_white_green_basketball_kit.jpg",true,true,"Basketball"],
["xlime-baseball-uniform","XLIME Baseball Uniform","Sports","Baseball","/images/official/01_white_vest_graphic_kit.jpg",true,true,"Baseball"],
["xlime-volleyball-team-set","XLIME Volleyball Team Set","Sports","Volleyball","/images/official/10_maroon_sports_set_neon_logo.jpg",true,true,"Volleyball"],
["xlime-rugby-training-jersey","XLIME Rugby Training Jersey","Sports","Rugby","/images/official/05_custom_clothing_black_tees.jpg",false,true,"Rugby"],
["xlime-training-jersey","XLIME Multi-Sport Training Jersey","Sports","Training Wear","/images/official/05_custom_clothing_black_tees.jpg",false,true,"Multi-Sport"],
["xlime-goalkeeper-training-top","XLIME Goalkeeper Training Top","Sports","Goalkeeper","https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=85",false,true,"Football"],
["xlime-team-shorts","XLIME Team Training Shorts","Sports","Training Wear","/images/official/03_black_white_football_kit.jpg",false,true,"Multi-Sport"],
["xlime-performance-leggings","XLIME Women's Performance Leggings","Gym & Active","Sports Leggings","https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=85",true,false,"Fitness"],
["xlime-training-sports-bra","XLIME Core Sports Bra","Gym & Active","Sports Bras","https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=85",true,false,"Fitness"],
["xlime-seamless-active-set","XLIME Seamless Active Set","Gym & Active","Activewear","/images/official/10_maroon_sports_set_neon_logo.jpg",true,false,"Fitness"],
["xlime-gym-training-top","XLIME Active Training Top","Gym & Active","Gymwear","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",false,false,"Fitness"],
["xlime-active-shorts","XLIME Active Training Shorts","Gym & Active","Gymwear","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=85",false,false,"Fitness"],
["xlime-training-joggers","XLIME Training Leggings","Gym & Active","Sports Leggings","https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85",false,false,"Fitness"],
["xlime-gym-bag","XLIME Gym Carry Bag","Gym & Active","Gymwear","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",false,false,"Fitness"],
["xlime-leather-jacket","XLIME Classic Leather Jacket","Leather","Jackets","https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",true,false,"Lifestyle"],
["xlime-leather-wallet","XLIME Leather Wallet","Leather","Wallets","https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=85",false,false,"Lifestyle"],
["xlime-leather-belt","XLIME Leather Belt","Leather","Belts","https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=85",false,false,"Lifestyle"],
["xlime-leather-bag","XLIME Leather Duffel","Leather","Bags","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",false,false,"Lifestyle"],
["xlime-core-hoodie","XLIME Core Hoodie","Fashion","Hoodies","https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",true,false,"Lifestyle"],
["xlime-graphic-tee","XLIME Oversized Tee","Fashion","T-Shirts","/images/official/05_custom_clothing_black_tees.jpg",true,false,"Lifestyle"],
["xlime-lifestyle-joggers","XLIME Lifestyle Jogger","Fashion","Joggers","/images/official/06_black_jersey_cream_cargos(1).jpg",false,false,"Lifestyle"],
["xlime-cap","XLIME Street Cap","Fashion","Caps","https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85",false,false,"Lifestyle"]
] as const;

const galleryMap: Record<string,string[]> = {
  "xlime-football-custom-kit": ["/images/official/11_black_green_custom_kit.jpg","/images/official/03_black_white_football_kit.jpg","/images/official/01_white_vest_graphic_kit.jpg"],
  "xlime-black-white-football-kit": ["/images/official/03_black_white_football_kit.jpg","/images/official/11_black_green_custom_kit.jpg","/images/official/01_white_vest_graphic_kit.jpg"],
  "xlime-basketball-uniform": ["/images/official/07_white_green_basketball_kit.jpg","/images/official/10_maroon_sports_set_neon_logo.jpg","/images/official/01_white_vest_graphic_kit.jpg"],
  "xlime-seamless-active-set": ["/images/official/10_maroon_sports_set_neon_logo.jpg","/images/official/09_black_tracksuit_premium_quality.jpg"],
  "xlime-core-hoodie": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85","/images/official/05_custom_clothing_black_tees.jpg","/images/official/06_black_jersey_cream_cargos(1).jpg"]
};

const permissionKeys = ["dashboard.view","products.manage","categories.manage","collections.manage","inventory.manage","orders.manage","teamOrders.manage","customKits.manage","quotes.manage","customers.manage","marketing.manage","analytics.view","audit.view","settings.manage","admins.manage","media.manage"];
const roleDefinitions = [
  { key:"SUPER_ADMIN", name:"Super Admin", permissions:permissionKeys },
  { key:"OPERATIONS_MANAGER", name:"Operations Manager", permissions:["dashboard.view","orders.manage","teamOrders.manage","customKits.manage","quotes.manage","customers.manage","analytics.view"] },
  { key:"CATALOG_MANAGER", name:"Catalog Manager", permissions:["dashboard.view","products.manage","categories.manage","collections.manage","inventory.manage","media.manage"] },
  { key:"DESIGN_TEAM", name:"Design Team", permissions:["dashboard.view","customKits.manage","customers.manage","media.manage"] },
  { key:"VIEWER", name:"Read-only Viewer", permissions:["dashboard.view","analytics.view","audit.view"] },
];

async function main(){
  const categoryByName = new Map<string,string>();
  for(const cat of categories){
    const row=await prisma.category.upsert({ where:{slug:cat.slug}, update:{...cat,subcategories:cat.subcategories,seoTitle:`${cat.name} | XLIME GEAR`,seoDescription:cat.description,isActive:true}, create:{...cat,subcategories:cat.subcategories,seoTitle:`${cat.name} | XLIME GEAR`,seoDescription:cat.description,isActive:true} });
    categoryByName.set(row.name,row.id);
  }

  const productBySlug = new Map<string,string>();
  let index=1;
  for(const [slug,name,categoryName,subcategory,imageUrl,featured,isCustomizable,sport] of products){
    const categoryId=categoryByName.get(categoryName)!;
    const sku=`XG-${String(index++).padStart(4,"0")}`;
    const shortDescription=`Premium ${name} from XLIME GEAR, designed for performance, comfort and team identity.`;
    const description=`${name} is part of the XLIME GEAR ${categoryName} collection. Built around premium materials, athletic fit and reliable finishing. Contact XLIME GEAR for availability, customisation, team quantities and order details.`;
    const product=await prisma.product.upsert({
      where:{slug},
      update:{name,sku,subcategory,imageUrl,altText:`${name} by XLIME GEAR`,featured,isCustomizable,teamOrderEligible:isCustomizable,categoryId,status:"ACTIVE",showPrice:false,stockQuantity:100,lowStockThreshold:10,sport,gender:categoryName==="Gym & Active"&&subcategory==="Sports Bras"?"Women":"Unisex",shortDescription,description,seoTitle:`${name} | XLIME GEAR`,seoDescription:shortDescription},
      create:{slug,name,sku,shortDescription,description,subcategory,imageUrl,altText:`${name} by XLIME GEAR`,featured,isCustomizable,teamOrderEligible:isCustomizable,categoryId,status:"ACTIVE",showPrice:false,stockQuantity:100,lowStockThreshold:10,sport,gender:categoryName==="Gym & Active"&&subcategory==="Sports Bras"?"Women":"Unisex",seoTitle:`${name} | XLIME GEAR`,seoDescription:shortDescription}
    });
    productBySlug.set(slug,product.id);
    const gallery=galleryMap[slug]||[imageUrl];
    await prisma.productImage.deleteMany({where:{productId:product.id}});
    await prisma.productImage.createMany({data:gallery.map((url,i)=>({productId:product.id,url,alt:`${name} product view ${i+1}`,sortOrder:i}))});
  }

  const isProduction=process.env.NODE_ENV==="production";
  const adminEmail=isProduction ? process.env.SEED_ADMIN_EMAIL : "admin@xlimegear.local";
  const adminPassword=isProduction ? process.env.SEED_ADMIN_PASSWORD : "Admin12345!";
  if(isProduction && (!adminEmail||!adminPassword||adminPassword.length<12)) throw new Error("Production seed requires SEED_ADMIN_EMAIL and a 12+ character SEED_ADMIN_PASSWORD.");
  const adminHash=await bcrypt.hash(adminPassword,12);
  const admin=await prisma.user.upsert({where:{email:adminEmail},update:isProduction?{role:"ADMIN",name:"XLIME Admin"}:{passwordHash:adminHash,role:"ADMIN",name:"XLIME Admin"},create:{email:adminEmail,passwordHash:adminHash,role:"ADMIN",name:"XLIME Admin",phone:"+44 7510 926711"}});
  if(!isProduction){
    const customerHash=await bcrypt.hash("Customer12345!",12);
    await prisma.user.upsert({where:{email:"customer@xlimegear.local"},update:{passwordHash:customerHash,name:"Demo Customer"},create:{email:"customer@xlimegear.local",passwordHash:customerHash,name:"Demo Customer",phone:"+44 7700 900123"}});
  }

  const permissionByKey=new Map<string,string>();
  for(const key of permissionKeys){ const row=await prisma.permission.upsert({where:{key},update:{name:key},create:{key,name:key}}); permissionByKey.set(key,row.id); }
  for(const roleDef of roleDefinitions){
    const role=await prisma.adminRole.upsert({where:{key:roleDef.key},update:{name:roleDef.name},create:{key:roleDef.key,name:roleDef.name}});
    await prisma.adminRolePermission.deleteMany({where:{roleId:role.id}});
    await prisma.adminRolePermission.createMany({data:roleDef.permissions.map(key=>({roleId:role.id,permissionId:permissionByKey.get(key)!}))});
  }
  const superRole=await prisma.adminRole.findUniqueOrThrow({where:{key:"SUPER_ADMIN"}});
  await prisma.adminMembership.upsert({where:{userId:admin.id},update:{roleId:superRole.id,isActive:true},create:{userId:admin.id,roleId:superRole.id,isActive:true}});

  const settings:Record<string,unknown>={
    showPublicPrices:false, enableCart:true, enableTeamOrders:true, enableCustomKits:true, enableProductEnquiries:true,
    contactDetails:{whatsapp:"+44 7510 926711",email:"info@xlimegear.com",website:"https://xlimegear.com",instagram:"@xlimegear"},
    brand:{name:"XLIME GEAR",primaryColor:"#C8FF00",darkBackground:"#080A08",lightBackground:"#F4F6F1"},
    seo:{siteName:"XLIME GEAR",defaultTitle:"XLIME GEAR | Custom Sportswear, Activewear & Team Kits",defaultDescription:"XLIME GEAR creates premium custom team kits, sportswear, activewear, leather goods and fashion for clubs, teams and individuals."}
  };
  for(const [key,value] of Object.entries(settings)) await prisma.storeSetting.upsert({where:{key},update:{value:value as any},create:{key,value:value as any}});

  await prisma.announcementBanner.upsert({where:{name:"primary"},update:{text:"NEW ARRIVAL ⚡ XLIME GEAR FOOTBALL KIT • UK Store Preview • Team & Bulk Orders",ctaText:"Instagram @xlimegear",ctaUrl:"https://www.instagram.com/xlimegear",background:"#C8FF00",textColor:"#080A08",isActive:true,isDismissible:true},create:{name:"primary",text:"NEW ARRIVAL ⚡ XLIME GEAR FOOTBALL KIT • UK Store Preview • Team & Bulk Orders",ctaText:"Instagram @xlimegear",ctaUrl:"https://www.instagram.com/xlimegear",background:"#C8FF00",textColor:"#080A08",isActive:true,isDismissible:true}});

  const collectionDefs=[
    {slug:"team-essentials",name:"Team Essentials",description:"Customisable products for clubs and teams",productSlugs:["xlime-football-custom-kit","xlime-basketball-uniform","xlime-volleyball-team-set","xlime-baseball-uniform"]},
    {slug:"womens-performance",name:"Women's Performance",description:"Performance leggings, sports bras and activewear",productSlugs:["xlime-performance-leggings","xlime-training-sports-bra","xlime-seamless-active-set"]},
    {slug:"featured",name:"Featured Products",description:"Highlighted XLIME GEAR products",productSlugs:["xlime-football-custom-kit","xlime-basketball-uniform","xlime-performance-leggings","xlime-core-hoodie"]},
  ];
  for(const [ci,c] of collectionDefs.entries()){
    const collection=await prisma.collection.upsert({where:{slug:c.slug},update:{name:c.name,description:c.description,isActive:true,sortOrder:ci+1},create:{slug:c.slug,name:c.name,description:c.description,isActive:true,sortOrder:ci+1}});
    await prisma.collectionProduct.deleteMany({where:{collectionId:collection.id}});
    await prisma.collectionProduct.createMany({data:c.productSlugs.map((slug,i)=>({collectionId:collection.id,productId:productBySlug.get(slug)!,sortOrder:i}))});
  }

  if(!isProduction){
    const teamSamples=[
      {requestNumber:"TEAM-QA-1001",organisation:"Riverside FC",contactName:"Mark Evans",email:"mark@riverside.example",phone:"+44 7700 900101",sport:"Football",numberOfPlayers:42,requirements:"Home and away custom kits with crest and player numbers.",packageInterest:"Performance Pack",stage:"QUOTE_SENT",status:"QUOTED" as const,quoteValuePence:248000},
      {requestNumber:"TEAM-QA-1002",organisation:"United Academy",contactName:"Sophia Clark",email:"sophia@unitedacademy.example",phone:"+44 7700 900102",sport:"Football",numberOfPlayers:35,requirements:"Academy match kits and training wear.",packageInterest:"Essential Pack",stage:"REQUIREMENTS",status:"REVIEWING" as const},
      {requestNumber:"TEAM-QA-1003",organisation:"City Rovers",contactName:"Liam Harris",email:"liam@cityrovers.example",phone:"+44 7700 900103",sport:"Rugby",numberOfPlayers:27,requirements:"Rugby training jerseys and shorts.",stage:"NEW_LEAD",status:"NEW" as const},
    ];
    for(const t of teamSamples) await prisma.teamOrderRequest.upsert({where:{requestNumber:t.requestNumber},update:t,create:t});

    const customer=await prisma.user.findUniqueOrThrow({where:{email:"customer@xlimegear.local"}});
    const kitSamples=[
      {requestNumber:"KIT-QA-2001",teamName:"Elite Academy",sport:"Football",primaryColor:"#C8FF00",secondaryColor:"#080A08",playerName:"PLAYER",playerNumber:"10",notes:"Home kit design with academy crest.",stage:"DESIGN_REVIEW",status:"REVIEWING" as const,userId:customer.id},
      {requestNumber:"KIT-QA-2002",teamName:"Northside FC",sport:"Football",primaryColor:"#111111",secondaryColor:"#FFFFFF",notes:"Away kit, minimal style.",stage:"AWAITING_ASSETS",status:"NEW" as const,userId:customer.id},
    ];
    for(const k of kitSamples) await prisma.customKitRequest.upsert({where:{requestNumber:k.requestNumber},update:k,create:k});

    await prisma.teamAccount.upsert({where:{organisation:"Riverside FC"},update:{primaryContact:"Mark Evans",email:"mark@riverside.example",sport:"Football",phone:"+44 7700 900101"},create:{organisation:"Riverside FC",organisationType:"Club",sport:"Football",primaryContact:"Mark Evans",email:"mark@riverside.example",phone:"+44 7700 900101",deliveryAddress:"Manchester, United Kingdom"}});

    const existingQuote=await prisma.quote.findUnique({where:{quoteNumber:"XLQ-QA-3001"}});
    if(!existingQuote) await prisma.quote.create({data:{quoteNumber:"XLQ-QA-3001",customerName:"Riverside FC",email:"mark@riverside.example",sourceType:"TEAM_ORDER",status:"SENT",subtotalPence:248000,totalPence:248000,createdById:admin.id,sentAt:new Date(),items:{create:[{description:"Custom team kit package",quantity:42,unitPence:5000,totalPence:210000},{description:"Names & numbers",quantity:42,unitPence:900,totalPence:37800}]}}});

    if(await prisma.campaign.count()===0) await prisma.campaign.create({data:{name:"Back to Training",type:"SEASONAL",status:"ACTIVE",headline:"Built for every team.",description:"Feature teamwear and active training products across the storefront.",destination:"/shop?category=sports"}});

    if(await prisma.notification.count()===0) await prisma.notification.createMany({data:[
      {type:"TEAM_ORDER",title:"New team order lead",message:"City Rovers submitted a 27-player rugby request.",entityType:"TeamOrderRequest"},
      {type:"CUSTOM_KIT",title:"Design review required",message:"Elite Academy custom kit is ready for design review.",entityType:"CustomKitRequest"},
      {type:"SYSTEM",title:"Admin V2 ready",message:"XLIME Operations Hub modules are ready for QA testing."}
    ]});

  }

  console.log(`Seeded ${products.length} products, Admin V2 roles/settings${isProduction?"":" and QA operations data"}.`);
}

main().finally(()=>prisma.$disconnect());
