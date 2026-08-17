"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { Package,ClipboardList,UsersRound,Palette,FileCheck2,TriangleAlert,ShoppingBag } from "lucide-react";
import { adminApi,fmtDate,pretty } from "@/lib/admin";
import { AdminPageHeader,MetricCard,Panel,StatusBadge,LoadingState,EmptyState,RowLink } from "@/components/admin/AdminUI";

export default function AdminCommandCenter(){
 const [data,setData]=useState<any>(null); const [error,setError]=useState("");
 const load=()=>{setError("");return adminApi.get("/dashboard").then(setData).catch(e=>setError(e.message))};
 useEffect(()=>{void load()},[]);
 if(!data&&!error)return <><AdminPageHeader title="Command Center" description="Live operational overview across catalog, orders, team requests and custom kit workflows."/><LoadingState/></>;
 const m=data?.metrics||{}; const teamPipe=data?.pipeline?.team||{};
 const pipeline=["NEW_LEAD","REQUIREMENTS","QUOTE_SENT","APPROVED","PRODUCTION","COMPLETED"];
 return <>
  <AdminPageHeader title="Command Center" description="Your business, what needs attention, and what should happen next." actions={<><button className="adm-btn" onClick={load}>Refresh</button><Link className="adm-btn primary" href="/admin/quotes/new">Create Quote</Link></>}/>
  {error&&<Panel><div className="adm-empty"><strong>Unable to load the command center</strong><p>{error}</p><button className="adm-btn" onClick={load}>Retry</button></div></Panel>}
  {data&&<>
   <div className="adm-grid metrics">
    <MetricCard label="Active Products" value={m.activeProducts||0} detail="Live in catalog" icon={<Package size={17}/>}/>
    <MetricCard label="Open Requests" value={m.openRequests||0} detail="Team + custom kit" icon={<ClipboardList size={17}/>} accent="info"/>
    <MetricCard label="Team Orders" value={m.teamOrders||0} detail="Active pipeline" icon={<UsersRound size={17}/>}/>
    <MetricCard label="Custom Kits" value={m.customKits||0} detail="Design workflow" icon={<Palette size={17}/>}/>
    <MetricCard label="Quotes Pending" value={m.pendingQuotes||0} detail="Draft / sent / awaiting" icon={<FileCheck2 size={17}/>} accent="warning"/>
    <MetricCard label="Low Stock" value={m.lowStock||0} detail={`${m.ordersToday||0} orders today`} icon={<TriangleAlert size={17}/>} accent={m.lowStock?"danger":"lime"}/>
   </div>

   <Panel title="Team Order Pipeline" subtitle="Click Team Orders to work the full lead board" action={<RowLink href="/admin/team-orders" label="Open Board"/>}>
    <div className="adm-pipeline">{pipeline.map(stage=><div key={stage}><span>{pretty(stage)}</span><strong>{teamPipe[stage]||0}</strong></div>)}</div>
   </Panel>

   <div className="adm-two" style={{marginTop:14}}>
    <Panel title="Recent Orders" subtitle="Newest order activity" action={<RowLink href="/admin/orders" label="View All"/>}>
     <div className="adm-table-wrap"><table className="adm-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Date</th></tr></thead><tbody>{data.recentOrders?.map((o:any)=><tr key={o.id}><td><Link className="adm-row-link" href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link></td><td>{o.customerName}</td><td>{o.items?.length||0}</td><td><StatusBadge value={o.status}/></td><td>{fmtDate(o.createdAt)}</td></tr>)}</tbody></table>{!data.recentOrders?.length&&<EmptyState title="No orders yet"/>}</div>
    </Panel>
    <Panel title="Action Centre" subtitle="Operational items that need attention">
     <div className="adm-action-list">
      <div className="adm-action-item"><div><b>Products missing gallery coverage</b><span>Improve product presentation and SEO imagery.</span></div><em>{data.actionCentre?.missingImages||0}</em></div>
      <div className="adm-action-item"><div><b>Low-stock products</b><span>Review inventory thresholds before stockouts.</span></div><em>{data.actionCentre?.lowStock||0}</em></div>
      <div className="adm-action-item"><div><b>Quotes awaiting action</b><span>Follow up before momentum drops.</span></div><em>{data.actionCentre?.pendingQuotes||0}</em></div>
      <div className="adm-action-item"><div><b>Unassigned team leads</b><span>Assign an owner and begin qualification.</span></div><em>{data.actionCentre?.unassignedTeamOrders||0}</em></div>
     </div>
    </Panel>
   </div>

   <div className="adm-three" style={{marginTop:14}}>
    <Panel title="Custom Kit Requests" action={<RowLink href="/admin/custom-kits" label="View All"/>}><div className="adm-action-list">{data.customKits?.map((r:any)=><div className="adm-action-item" key={r.id}><div><b>{r.teamName||r.user?.name||"Customer"}</b><span>{r.requestNumber} • {r.sport}</span></div><StatusBadge value={r.stage}/></div>)}</div></Panel>
    <Panel title="Team Order Leads" action={<RowLink href="/admin/team-orders" label="View All"/>}><div className="adm-action-list">{data.teamOrders?.map((r:any)=><div className="adm-action-item" key={r.id}><div><b>{r.organisation}</b><span>{r.numberOfPlayers||"—"} players • {r.sport}</span></div><StatusBadge value={r.stage}/></div>)}</div></Panel>
    <Panel title="Top Product Interest" action={<RowLink href="/admin/analytics/products" label="Insights"/>}><div className="adm-action-list">{data.topProducts?.map((p:any)=><div className="adm-action-item" key={p.id}><div><b>{p.name}</b><span>{p.viewCount} views • {p.enquiryCount} enquiries</span></div><em>{p.teamRequestCount||0}</em></div>)}</div></Panel>
   </div>
  </>}
 </>
}
