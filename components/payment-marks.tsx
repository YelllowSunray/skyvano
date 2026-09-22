type MarkProps = {
  className?: string;
};

function IdealMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#CC0066" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        iDEAL
      </text>
    </svg>
  );
}

function VisaMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#1A1F71" />
      <text
        x="19"
        y="16.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontStyle="italic"
        fontWeight="800"
        fontFamily="Georgia, Times, serif"
        letterSpacing="0.5"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#252525" />
      <circle cx="15.5" cy="12" r="6.2" fill="#EB001B" />
      <circle cx="22.5" cy="12" r="6.2" fill="#F79E1B" />
      <path
        d="M19 7.2a6.2 6.2 0 0 1 0 9.6 6.2 6.2 0 0 1 0-9.6z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#2E77BC" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.8"
      >
        AMEX
      </text>
    </svg>
  );
}

function ApplePayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#000" />
      <path
        fill="#fff"
        d="M11.6 8.1c.3-.4.5-.9.4-1.4-.4 0-1 .3-1.3.7-.3.3-.6.8-.5 1.3.5 0 1-.3 1.4-.6zM12.6 8.7c-.8 0-1.5.4-1.8.4s-1-.4-1.6-.4c-.8 0-1.6.5-2 1.2-.9 1.5-.2 3.7.6 4.9.4.6.9 1.2 1.5 1.2s.9-.4 1.6-.4 1 .4 1.6.4.11-.6 1.5-1.2c.3-.4.5-.9.7-1.4-1.6-.6-1.8-2.8-.2-3.7-.4-.6-1.1-1-1.9-1z"
      />
      <text
        x="26"
        y="15.8"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="600"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

function GooglePayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#fff" />
      <path
        fill="#4285F4"
        d="M12.2 12.1c0-.3 0-.6-.1-.8H9.4v1.5h1.6c-.1.4-.4.8-.8 1.1v.9h1.2c.7-.7.9-1.8.8-2.7z"
      />
      <path
        fill="#34A853"
        d="M9.4 15.5c1.1 0 2-.3 2.6-.9l-1.2-1c-.4.2-.8.4-1.4.4-1 0-1.9-.7-2.2-1.6H5.9v1c.6 1.3 1.9 2.1 3.5 2.1z"
      />
      <path
        fill="#FBBC04"
        d="M7.2 12.4c-.1-.3-.1-.5-.1-.8s0-.5.1-.8V9.8H5.9A3.6 3.6 0 005.5 12c0 .8.1 1.5.4 2.2l1.3-1.8z"
      />
      <path
        fill="#EA4335"
        d="M9.4 8.6c.6 0 1.1.2 1.5.6l1.1-1.1C11.3 7.3 10.4 7 9.4 7 7.8 7 6.5 7.8 5.9 9.1l1.3 1c.3-.9 1.2-1.5 2.2-1.5z"
      />
      <text
        x="26.5"
        y="15.6"
        textAnchor="middle"
        fill="#5F6368"
        fontSize="8"
        fontWeight="600"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

function ShopPayMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#5A31F4" />
      <text
        x="19"
        y="15.8"
        textAnchor="middle"
        fill="#fff"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        Shop Pay
      </text>
    </svg>
  );
}

function KlarnaMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#FFB3C7" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fill="#0B051D"
        fontSize="8"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        Klarna
      </text>
    </svg>
  );
}

function PayPalMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden="true">
      <rect width="38" height="24" rx="3" fill="#003087" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        PayPal
      </text>
    </svg>
  );
}

const MARKS = [
  { label: "iDEAL", Icon: IdealMark },
  { label: "Visa", Icon: VisaMark },
  { label: "Mastercard", Icon: MastercardMark },
  { label: "Amex", Icon: AmexMark },
  { label: "Apple Pay", Icon: ApplePayMark },
  { label: "Google Pay", Icon: GooglePayMark },
  { label: "Shop Pay", Icon: ShopPayMark },
  { label: "Klarna", Icon: KlarnaMark },
  { label: "PayPal", Icon: PayPalMark },
] as const;

export function PaymentMarks() {
  return (
    <ul className="flex flex-wrap items-center gap-1.5">
      {MARKS.map(({ label, Icon }) => (
        <li key={label}>
          <span title={label} className="block overflow-hidden rounded-[4px]">
            <Icon className="h-7 w-auto sm:h-8" />
            <span className="sr-only">{label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
