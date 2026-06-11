import { useEffect, useState } from "react";
import { defaultCompany, fetchCompany, type DbCompany } from "@/lib/content-db";

let cache: DbCompany | null = null;

export function useCompany(): DbCompany {
  const [c, setC] = useState<DbCompany>(cache ?? defaultCompany);
  useEffect(() => {
    if (cache) { setC(cache); return; }
    fetchCompany().then((d) => { cache = d; setC(d); });
  }, []);
  return c;
}
