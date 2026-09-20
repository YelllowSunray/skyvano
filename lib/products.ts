export type Category = "women" | "men" | "accessories";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  tags: Array<"new" | "bestseller" | "sale">;
  colors: ProductColor[];
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const collections = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    description: "The latest pieces from our curated designer edit.",
    image: img("photo-1490481651871-ab68de25d43d", 1600),
  },
  {
    slug: "women",
    title: "Women",
    description: "Tailoring, silk, outerwear and evening pieces.",
    image: img("photo-1529139574466-a303027c1d8b", 1600),
  },
  {
    slug: "men",
    title: "Men",
    description: "Contemporary tailoring and statement outerwear.",
    image: img("photo-1617137968427-85924c800a22", 1600),
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Bags, scarves, eyewear and finishing pieces.",
    image: img("photo-1566150905458-1bf1fc113f0d", 1600),
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    description: "The most requested pieces from the Skyvano edit.",
    image: img("photo-1469334031218-e382a71b716b", 1600),
  },
  {
    slug: "sale",
    title: "Sale",
    description: "Selected designer pieces, now at a reduced price.",
    image: img("photo-1445205170230-053b83016050", 1600),
  },
] as const;

export const houses = [
  "Gucci",
  "Prada",
  "Burberry",
  "Michael Kors",
  "Rick Owens",
  "Saint Laurent",
];

export const products: Product[] = [
  {
    id: "sv-001",
    slug: "structured-wool-wrap-coat",
    name: "Structured Wool Wrap Coat",
    brand: "Burberry",
    price: 1890,
    category: "women",
    tags: ["new", "bestseller"],
    colors: [
      { name: "Camel", hex: "#c4a574" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Ivory", hex: "#e8e0d4" },
    ],
    images: [
      img("photo-1539109136881-3be0616acf4b"),
      img("photo-1487222477894-8943e31ef7b2"),
    ],
    description:
      "A sculpted wool wrap coat with a clean collar and elongated line. Designed to sit over tailoring or evening silk with the same quiet authority.",
    details: [
      "Virgin wool blend",
      "Internal button fastening",
      "Made in Italy",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "sv-002",
    slug: "draped-silk-blouse",
    name: "Draped Silk Blouse",
    brand: "Gucci",
    price: 890,
    category: "women",
    tags: ["new"],
    colors: [
      { name: "Ivory", hex: "#efe6d9" },
      { name: "Black", hex: "#111111" },
    ],
    images: [
      img("photo-1509631179647-0177331693ae"),
      img("photo-1524504388940-b1c1722653e1"),
    ],
    description:
      "Fluid silk with a softly draped neckline. Wear tucked into tailored trousers or left loose over a leather skirt.",
    details: ["100% silk", "Concealed back zip", "Made in Italy", "Hand wash"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sv-003",
    slug: "leather-midi-column-dress",
    name: "Leather Midi Column Dress",
    brand: "Saint Laurent",
    price: 2450,
    category: "women",
    tags: ["bestseller"],
    colors: [
      { name: "Black", hex: "#0d0d0d" },
      { name: "Bordeaux", hex: "#5c1f2a" },
    ],
    images: [
      img("photo-1496747611176-843222e1e57c"),
      img("photo-1529139574466-a303027c1d8b"),
    ],
    description:
      "A precise leather column with a high neck and midi hem. Evening-ready without ornament — the cut does the work.",
    details: [
      "Lambskin leather",
      "Lined interior",
      "Made in Italy",
      "Specialist leather clean",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sv-004",
    slug: "tailored-pleat-trousers",
    name: "Tailored Pleat Trousers",
    brand: "Prada",
    price: 720,
    category: "women",
    tags: ["new"],
    colors: [
      { name: "Charcoal", hex: "#3b3b3b" },
      { name: "Stone", hex: "#c5bba8" },
      { name: "Navy", hex: "#1d2740" },
    ],
    images: [
      img("photo-1594633312681-425c7b97ccd1"),
      img("photo-1509631179647-0177331693ae"),
    ],
    description:
      "Pressed pleats, a high waist and a cropped ankle. The kind of trouser that makes a white shirt feel finished.",
    details: ["Wool blend", "Hook-and-bar closure", "Made in Italy"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "sv-005",
    slug: "cashmere-crew-knit",
    name: "Cashmere Crew Knit",
    brand: "Michael Kors",
    price: 320,
    compareAtPrice: 420,
    category: "women",
    tags: ["sale"],
    colors: [
      { name: "Camel", hex: "#c2a27a" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Cream", hex: "#f0eadc" },
    ],
    images: [
      img("photo-1434389677669-e08b4cac3105"),
      img("photo-1576566588028-4147f3842f27"),
    ],
    description:
      "A fine-gauge cashmere crew with a quiet luxury hand-feel. Layer under a coat or wear alone with tailored denim.",
    details: ["100% cashmere", "Ribbed cuffs and hem", "Made in Scotland"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "sv-006",
    slug: "silk-bias-slip-dress",
    name: "Silk Bias Slip Dress",
    brand: "Saint Laurent",
    price: 980,
    compareAtPrice: 1280,
    category: "women",
    tags: ["sale", "bestseller"],
    colors: [
      { name: "Champagne", hex: "#d8c3a5" },
      { name: "Black", hex: "#111111" },
    ],
    images: [
      img("photo-1515372039744-b8f02a3ae446"),
      img("photo-1496747611176-843222e1e57c"),
    ],
    description:
      "Cut on the bias in liquid silk. A dress that reads as evening or, with a blazer, as the most considered day look.",
    details: ["100% silk satin", "Adjustable straps", "Made in France"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sv-007",
    slug: "leather-biker-jacket",
    name: "Leather Biker Jacket",
    brand: "Rick Owens",
    price: 2890,
    category: "men",
    tags: ["bestseller"],
    colors: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Oxblood", hex: "#4a1c22" },
    ],
    images: [
      img("photo-1552374196-1ab2a1c593e8"),
      img("photo-1551028719-00167b16eac5"),
    ],
    description:
      "Elongated leather with an architectural shoulder. A signature piece — dark, precise, and built to last.",
    details: [
      "Calf leather",
      "Asymmetric zip",
      "Made in Italy",
      "Specialist leather clean",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sv-008",
    slug: "tailored-wool-suit",
    name: "Tailored Wool Suit",
    brand: "Gucci",
    price: 3200,
    category: "men",
    tags: ["new"],
    colors: [
      { name: "Charcoal", hex: "#2f2f2f" },
      { name: "Navy", hex: "#1b2744" },
    ],
    images: [
      img("photo-1617137968427-85924c800a22"),
      img("photo-1594938298603-c8148c4dae35"),
    ],
    description:
      "Soft-shouldered tailoring in superfine wool. Cut to feel current without chasing a trend.",
    details: ["Superfine wool", "Fully lined", "Two-piece set", "Made in Italy"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sv-009",
    slug: "technical-nylon-coat",
    name: "Technical Nylon Coat",
    brand: "Prada",
    price: 1650,
    category: "men",
    tags: ["new", "bestseller"],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Olive", hex: "#4a5240" },
    ],
    images: [
      img("photo-1490114538077-0a7f8cb49891"),
      img("photo-1617137984095-74e4e5e3613f"),
    ],
    description:
      "Lightweight nylon with a sharp, almost military line. Rain-ready without looking technical.",
    details: ["Re-nylon shell", "Drawstring hood", "Made in Italy"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sv-010",
    slug: "check-overshirt",
    name: "Heritage Check Overshirt",
    brand: "Burberry",
    price: 890,
    category: "men",
    tags: ["new"],
    colors: [
      { name: "Archive Check", hex: "#8b5a2b" },
      { name: "Black Check", hex: "#2a2a2a" },
    ],
    images: [
      img("photo-1603252109303-2751441dd157"),
      img("photo-1593030761757-71fae45fa0e7"),
    ],
    description:
      "A lightweight overshirt in heritage check. Layer over a knit or close it as a light jacket.",
    details: ["Cotton gabardine", "Chest pockets", "Made in the United Kingdom"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sv-011",
    slug: "leather-low-sneaker",
    name: "Leather Low Sneaker",
    brand: "Rick Owens",
    price: 590,
    compareAtPrice: 790,
    category: "men",
    tags: ["sale"],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Milk", hex: "#f2ece3" },
    ],
    images: [
      img("photo-1549298916-b41d501d3772"),
      img("photo-1560769629-975ec94e6a86"),
    ],
    description:
      "A pared-back leather sneaker with an extended sole. Quiet enough for tailoring, distinct enough to be noticed.",
    details: ["Calf leather upper", "Rubber sole", "Made in Italy"],
    sizes: ["40", "41", "42", "43", "44", "45"],
  },
  {
    id: "sv-012",
    slug: "oversized-cotton-hoodie",
    name: "Oversized Cotton Hoodie",
    brand: "Rick Owens",
    price: 680,
    category: "men",
    tags: ["bestseller"],
    colors: [
      { name: "Black", hex: "#0d0d0d" },
      { name: "Pearl", hex: "#e6e1d8" },
    ],
    images: [
      img("photo-1556821840-3a63f95609a7"),
      img("photo-1521577352947-9bb58764b69a"),
    ],
    description:
      "An oversized hoodie in heavyweight cotton. The volume is the point — wear it with tapered trousers or leather.",
    details: ["Organic cotton fleece", "Kangaroo pocket", "Made in Portugal"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sv-013",
    slug: "quilted-leather-shoulder-bag",
    name: "Quilted Leather Shoulder Bag",
    brand: "Gucci",
    price: 2450,
    category: "accessories",
    tags: ["new", "bestseller"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Dusty Rose", hex: "#c9a9a6" },
      { name: "Gold", hex: "#c6a15b" },
    ],
    images: [
      img("photo-1584917865442-de89df76afd3"),
      img("photo-1566150905458-1bf1fc113f0d"),
    ],
    description:
      "Soft quilted leather with a chain-and-leather strap. Sized for evening, structured enough for day.",
    details: [
      "Calf leather",
      "Detachable strap",
      "Interior zip pocket",
      "Made in Italy",
    ],
    sizes: ["One Size"],
  },
  {
    id: "sv-014",
    slug: "saffiano-leather-tote",
    name: "Saffiano Leather Tote",
    brand: "Prada",
    price: 1890,
    category: "accessories",
    tags: ["bestseller"],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Sienna", hex: "#8a5a3b" },
    ],
    images: [
      img("photo-1548036328-c9fa89d128fa"),
      img("photo-1591561954557-26941169b49e"),
    ],
    description:
      "A structured tote in saffiano leather. The everyday bag that still looks considered at dinner.",
    details: ["Saffiano leather", "Internal pouch", "Made in Italy"],
    sizes: ["One Size"],
  },
  {
    id: "sv-015",
    slug: "heritage-check-scarf",
    name: "Heritage Check Scarf",
    brand: "Burberry",
    price: 390,
    category: "accessories",
    tags: ["new"],
    colors: [
      { name: "Classic Check", hex: "#9a6b3f" },
      { name: "Camel", hex: "#c4a574" },
    ],
    images: [
      img("photo-1520903920243-00d872a2d1c9"),
      img("photo-1601924994987-69e26d50dc26"),
    ],
    description:
      "Lightweight cashmere-blend check, finished with a fine fringe. An heirloom accessory in the most useful sense.",
    details: ["Cashmere and silk blend", "Fringed edges", "Made in Scotland"],
    sizes: ["One Size"],
  },
  {
    id: "sv-016",
    slug: "logo-plaque-belt",
    name: "Logo Plaque Belt",
    brand: "Michael Kors",
    price: 180,
    compareAtPrice: 220,
    category: "accessories",
    tags: ["sale"],
    colors: [
      { name: "Black / Gold", hex: "#c6a15b" },
      { name: "Brown / Gold", hex: "#6b4226" },
    ],
    images: [
      img("photo-1592878904946-b3cd8ae243d0"),
      img("photo-1553062407-98eeb64c6a62"),
    ],
    description:
      "Smooth leather with a gold-tone plaque buckle. The finishing piece that sharpens a coat or a dress.",
    details: ["Leather", "Adjustable", "Made in Italy"],
    sizes: ["75", "80", "85", "90", "95"],
  },
  {
    id: "sv-017",
    slug: "geometric-sunglasses",
    name: "Geometric Sunglasses",
    brand: "Prada",
    price: 340,
    category: "accessories",
    tags: ["new"],
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Havana", hex: "#6b3f24" },
    ],
    images: [
      img("photo-1511499767150-a48a237f0083"),
      img("photo-1572635196237-14b3f281503f"),
    ],
    description:
      "Angular acetate frames with a slim gold temple. Graphic without being loud.",
    details: ["Acetate frame", "UV400 lenses", "Made in Italy", "Includes case"],
    sizes: ["One Size"],
  },
  {
    id: "sv-018",
    slug: "leather-card-holder",
    name: "Leather Card Holder",
    brand: "Gucci",
    price: 290,
    category: "accessories",
    tags: ["new"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Bordeaux", hex: "#5c1f2a" },
    ],
    images: [
      img("photo-1627123424574-724758594e93"),
      img("photo-1553062407-98eeb64c6a62"),
    ],
    description:
      "A slim card holder in grained leather. Four slots, nothing extra — the way a small leather good should feel.",
    details: ["Grained calf leather", "Four card slots", "Made in Italy"],
    sizes: ["One Size"],
  },
];

export const instagramImages = [
  img("photo-1469334031218-e382a71b716b", 800),
  img("photo-1529139574466-a303027c1d8b", 800),
  img("photo-1617137968427-85924c800a22", 800),
  img("photo-1584917865442-de89df76afd3", 800),
  img("photo-1490481651871-ab68de25d43d", 800),
  img("photo-1509631179647-0177331693ae", 800),
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCollection(slug: string) {
  if (slug === "new-arrivals") {
    return products.filter((product) => product.tags.includes("new"));
  }
  if (slug === "best-sellers") {
    return products.filter((product) => product.tags.includes("bestseller"));
  }
  if (slug === "sale") {
    return products.filter((product) => product.tags.includes("sale"));
  }
  if (slug === "women" || slug === "men" || slug === "accessories") {
    return products.filter((product) => product.category === slug);
  }
  return products;
}

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, limit);
}

export function searchProducts(query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return products;
  return products.filter((product) =>
    [product.name, product.brand, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(value),
  );
}
