import { COMPANY, companyAddressLines } from "@/lib/site";

export function CompanyImprint({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-white/45" : "text-muted";
  const ink = tone === "dark" ? "text-white/70" : "text-ink";

  return (
    <address className={`not-italic text-[11px] leading-5 ${muted}`}>
      <p className={ink}>{COMPANY.legalName}</p>
      {companyAddressLines().map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="mt-2">
        KVK {COMPANY.kvk}
        <span aria-hidden> · </span>
        BTW-id {COMPANY.vatId}
      </p>
      <p>
        <a href={`mailto:${COMPANY.email}`} className={`${ink} hover:text-gold`}>
          {COMPANY.email}
        </a>
        <span aria-hidden> · </span>
        <a href={`tel:${COMPANY.phone}`} className={`${ink} hover:text-gold`}>
          {COMPANY.phoneDisplay}
        </a>
      </p>
    </address>
  );
}
