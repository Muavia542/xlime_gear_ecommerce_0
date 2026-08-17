import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const checks=[];
const must=(condition,label)=>checks.push({label,ok:Boolean(condition)});
const exists=(p)=>fs.existsSync(path.join(root,p));
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");

must(exists("frontend/app/robots.ts"),"robots.ts exists");
must(exists("frontend/app/sitemap.ts"),"sitemap.ts exists");
must(exists("frontend/app/manifest.ts"),"manifest exists");
must(read("frontend/app/layout.tsx").includes("Organization"),"Organization JSON-LD configured");
must(read("frontend/app/product/[slug]/page.tsx").includes('"@type":"Product"'),"Product JSON-LD configured");
must(exists("frontend/app/shop/[category]/[subcategory]/page.tsx"),"Programmatic subcategory SEO route exists");
must(read("frontend/next.config.mjs").includes("X-Content-Type-Options"),"Frontend security headers configured");
must(read("backend/src/app.ts").includes("helmet("),"Helmet enabled");
must(read("backend/src/app.ts").includes("rateLimit("),"API rate limiting enabled");
must(read("backend/src/middleware/permission.middleware.ts").includes("requirePermission"),"Admin RBAC middleware exists");
must(exists("backend/prisma/migrations/202608120002_admin_v2/migration.sql"),"Admin V2 migration included");
must(exists("docs/HOSTINGER_DEPLOYMENT.md"),"Hostinger deployment guide included");

must(exists("frontend/app/storefront-approved.css"),"Approved storefront CSS port exists");
must(read("frontend/app/layout.tsx").includes("storefront-approved.css"),"Approved storefront CSS is loaded");
must(read("frontend/components/home/HomeStorefront.tsx").includes("Custom kit studio"),"Homepage custom kit studio included");
must(read("frontend/components/home/HomeStorefront.tsx").includes("Build your XLIME bag"),"Homepage bag builder included");
must(read("frontend/components/home/HomeStorefront.tsx").includes("Kit out"),"Homepage team-order CTA included");
must(exists("frontend/app/admin/products/[id]/edit/page.tsx"),"Admin product edit route exists");
must(read("frontend/next.config.mjs").includes("qualities:[75,82]"),"Next Image qualities configured");
must(exists("UPDATE_EXISTING_DATABASE_V2.bat"),"Safe V2 database updater included");
must(exists("docs/APPROVED_UI_REFERENCE.html"),"Approved HTML UI reference preserved");

for(const c of checks) console.log(`${c.ok?"PASS":"FAIL"}  ${c.label}`);
if(checks.some(c=>!c.ok)) process.exit(1);
console.log(`\n${checks.length}/${checks.length} static QA checks passed.`);
