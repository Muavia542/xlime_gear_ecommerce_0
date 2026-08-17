"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SiteFrame from "@/components/layout/SiteFrame";

function LoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next");
    const target = next ? `/account?mode=signin&next=${encodeURIComponent(next)}` : "/account?mode=signin";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <SiteFrame>
      <section className="section wrap" style={{ textAlign: "center", padding: "60px 20px" }}>
        <p className="muted">Redirecting to XLIME Account sign in…</p>
        <p style={{ marginTop: 12 }}>
          <Link href="/account?mode=signin" className="btn primary sm">
            Click here if not redirected
          </Link>
        </p>
      </section>
    </SiteFrame>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginRedirectContent />
    </Suspense>
  );
}
