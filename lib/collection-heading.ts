import { type Department } from "@/lib/products";

const DEPARTMENTS = new Set<Department>(["clothing", "shoes", "accessories"]);

const DEPARTMENT_LABEL: Record<Department, string> = {
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
};

export function isDepartment(value: string | undefined): value is Department {
  return Boolean(value && DEPARTMENTS.has(value as Department));
}

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type HeadingNav = Array<{
  gender: string;
  departments: Array<{
    slug: string;
    categories: Array<{ slug: string; name: string }>;
  }>;
}>;

export function collectionHeading(
  slug: string,
  category: string | undefined,
  department: string | undefined,
  nav: HeadingNav,
) {
  if (slug !== "women" && slug !== "men") return undefined;
  const gender = slug === "women" ? "Women" : "Men";
  const item = nav.find((entry) => entry.gender === slug);
  if (category) {
    const name = item?.departments
      .flatMap((entry) => entry.categories)
      .find((entry) => entry.slug === category)?.name;
    return `${gender}’s ${name ?? titleCase(category)}`;
  }
  if (isDepartment(department)) {
    return `${gender}’s ${DEPARTMENT_LABEL[department]}`;
  }
  return undefined;
}

export function headingFromCollectionHref(href: string, nav: HeadingNav) {
  const url = new URL(href, "https://skyvano.com");
  const slug = url.pathname.split("/").filter(Boolean)[1] ?? "";
  const category = url.searchParams.get("category") ?? undefined;
  const department = url.searchParams.get("department") ?? undefined;
  return (
    collectionHeading(slug, category, department, nav) ??
    (slug ? titleCase(slug) : "Collection")
  );
}
