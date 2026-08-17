"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Globe2,
  Mail,
  MessageCircle,
} from "lucide-react";

import HeroCarousel from "@/components/home/HeroCarousel";
import ContactStrip from "@/components/layout/ContactStrip";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import InstagramIcon from "@/components/icons/InstagramIcon";

import type { Category, Product } from "@/lib/types";
import { assetUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const categoryFallback: Record<
  string,
  {
    copy: string;
    subs: string[];
    img: string;
  }
> = {
  sports: {
    copy:
      "Football kits, basketball, volleyball, baseball, rugby and multi-sport team uniforms.",
    subs: [
      "Football Kits",
      "Basketball",
      "Volleyball",
      "Training Wear",
    ],
    img:
      "https://images.pexels.com/photos/20615456/pexels-photo-20615456.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",
  },

  "gym-active": {
    copy:
      "Sports leggings, sports bras, activewear, training tops and gym essentials.",
    subs: [
      "Sports Leggings",
      "Sports Bras",
      "Activewear",
      "Gymwear",
    ],
    img:
      "https://images.pexels.com/photos/6572566/pexels-photo-6572566.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop",
  },

  leather: {
    copy:
      "Leather jackets, wallets, belts, bags and selected accessories.",
    subs: [
      "Jackets",
      "Wallets",
      "Belts",
      "Bags",
    ],
    img:
      "https://images.pexels.com/photos/8386443/pexels-photo-8386443.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",
  },

  fashion: {
    copy:
      "Hoodies, T-shirts, joggers, tracksuits and off-pitch lifestyle pieces.",
    subs: [
      "Hoodies",
      "T-Shirts",
      "Joggers",
      "Caps",
    ],
    img:
      "https://images.pexels.com/photos/12768660/pexels-photo-12768660.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",
  },
};

const sportsDiscovery = [
  [
    "Football Kits",
    "sports",
    "football-kits",
    "https://images.pexels.com/photos/19799186/pexels-photo-19799186.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
  ],
  [
    "Basketball",
    "sports",
    "basketball",
    "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1000&h=900&fit=crop",
  ],
  [
    "Volleyball",
    "sports",
    "volleyball",
    "https://images.pexels.com/photos/6203535/pexels-photo-6203535.jpeg?auto=compress&cs=tinysrgb&w=1000&h=900&fit=crop",
  ],
  [
    "Baseball",
    "sports",
    "baseball",
    "/images/official/01_white_vest_graphic_kit.jpg",
  ],
  [
    "Training Wear",
    "sports",
    "training-wear",
    "https://images.pexels.com/photos/3763876/pexels-photo-3763876.jpeg?auto=compress&cs=tinysrgb&w=1000&h=900&fit=crop",
  ],
  [
    "Sports Leggings",
    "gym-active",
    "sports-leggings",
    "https://images.pexels.com/photos/11121629/pexels-photo-11121629.jpeg?auto=compress&cs=tinysrgb&w=1000&h=900&fit=crop",
  ],
  [
    "Sports Bras",
    "gym-active",
    "sports-bras",
    "https://images.pexels.com/photos/6572566/pexels-photo-6572566.jpeg?auto=compress&cs=tinysrgb&w=1000&h=900&fit=crop",
  ],
  [
    "Team Apparel",
    "sports",
    "training-wear",
    "https://images.pexels.com/photos/20615456/pexels-photo-20615456.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
  ],
] as const;

function ProductRail({
  products,
  onQuick,
}: {
  products: Product[];
  onQuick: (product: Product) => void;
}) {
  return (
    <div className="product-rail">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuick}
        />
      ))}
    </div>
  );
}

function CustomKitStudio() {
  const [color, setColor] = useState("#C8FF00");
  const [name, setName] = useState("PLAYER");
  const [number, setNumber] = useState("10");

  const colours = [
    "#C8FF00",
    "#1fc7ff",
    "#ff4141",
    "#ffffff",
  ];

  return (
    <div className="custom-studio">
      <div className="kit-preview">
        <div className="jerseys">
          <svg
            className="jersey-svg"
            viewBox="0 0 300 360"
            aria-label="Front custom jersey preview"
          >
            <path
              fill="#111"
              stroke="#333"
              strokeWidth="4"
              d="M84 36 35 65 15 140 58 154 70 120 70 334 230 334 230 120 242 154 285 140 265 65 216 36 184 55 116 55Z"
            />

            <path
              fill={color}
              opacity=".85"
              d="M78 88 116 55h68l38 33-23 22-34-24h-30l-34 24Z"
            />

            <path
              fill={color}
              opacity=".6"
              d="m74 185 156-70v42L74 226Z"
            />

            <text
              x="150"
              y="155"
              fill="#fff"
              fontSize="25"
              textAnchor="middle"
              fontWeight="700"
            >
              XLIME
            </text>
          </svg>

          <svg
            className="jersey-svg"
            viewBox="0 0 300 360"
            aria-label="Back custom jersey preview"
          >
            <path
              fill="#111"
              stroke="#333"
              strokeWidth="4"
              d="M84 36 35 65 15 140 58 154 70 120 70 334 230 334 230 120 242 154 285 140 265 65 216 36 184 55 116 55Z"
            />

            <text
              x="150"
              y="140"
              fill="#fff"
              fontSize="20"
              textAnchor="middle"
            >
              {name || "PLAYER"}
            </text>

            <text
              x="150"
              y="230"
              fill={color}
              fontSize="100"
              textAnchor="middle"
              fontWeight="800"
            >
              {number || "10"}
            </text>
          </svg>
        </div>
      </div>

      <div className="kit-controls">
        <span className="eyebrow">
          Quick customiser
        </span>

        <h3
          className="display"
          style={{
            fontSize: 38,
            margin: "7px 0 20px",
          }}
        >
          Your team. Your colours. Your kit.
        </h3>

        <div className="control-row">
          <div className="field-title">
            Primary colour
          </div>

          <div className="colors">
            {colours.map((colour) => (
              <button
                key={colour}
                type="button"
                aria-label={`Use ${colour}`}
                onClick={() => setColor(colour)}
                className={`color ${
                  color === colour ? "active" : ""
                }`}
                style={{
                  background: colour,
                }}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="custom-player-name">
            Player name
          </label>

          <input
            id="custom-player-name"
            value={name}
            maxLength={14}
            onChange={(event) =>
              setName(
                event.target.value.toUpperCase()
              )
            }
          />
        </div>

        <div className="field">
          <label htmlFor="custom-player-number">
            Number
          </label>

          <input
            id="custom-player-number"
            value={number}
            maxLength={2}
            inputMode="numeric"
            onChange={(event) =>
              setNumber(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
          />
        </div>

        <Link
          href="/custom-kits"
          className="btn primary full"
        >
          Open custom kit studio
        </Link>
      </div>
    </div>
  );
}

function BagBuilder({
  products,
}: {
  products: Product[];
}) {
  const { add, openDrawer } = useCart();

  const wanted = [
    "Football Kits",
    "Sports Leggings",
    "Sports Bras",
    "Jackets",
    "Hoodies",
  ];

  const matches = wanted
    .map((subcategory) =>
      products.find(
        (product) =>
          product.subcategory === subcategory
      )
    )
    .filter(Boolean) as Product[];

  const [checked, setChecked] = useState<
    Record<string, boolean>
  >({});

  const [busy, setBusy] =
    useState(false);

  const [
    selectedMessage,
    setSelectedMessage,
  ] = useState("");

  async function addSelected() {
    const ids = matches
      .filter(
        (product) =>
          checked[product.id]
      )
      .map(
        (product) => product.id
      );

    if (!ids.length) {
      setSelectedMessage(
        "Select at least one item."
      );
      return;
    }

    setBusy(true);

    try {
      for (const id of ids) {
        await add(id);
      }

      openDrawer();

      setSelectedMessage(
        `${ids.length} item${
          ids.length === 1 ? "" : "s"
        } added to your XLIME bag.`
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bag-builder">
      <div>
        <span
          className="eyebrow"
          style={{
            color: "#657e00",
          }}
        >
          Cross-category shopping
        </span>

        <h2 className="h2">
          Build your XLIME bag
        </h2>

        <p className="muted">
          Mix sports, gym, leather and
          fashion essentials in a single
          preview bundle.
        </p>
      </div>

      <div className="bag-list">
        {matches.map((product) => (
          <label
            className="bag-row"
            key={product.id}
          >
            <input
              type="checkbox"
              checked={
                !!checked[product.id]
              }
              onChange={(event) =>
                setChecked(
                  (previous) => ({
                    ...previous,
                    [product.id]:
                      event.target
                        .checked,
                  })
                )
              }
            />

            <Image
              src={assetUrl(
                product.imageUrl
              )}
              width={70}
              height={55}
              alt={
                product.altText ||
                product.name
              }
            />

            <span>
              {product.name.replace(
                /^XLIME\s+/i,
                ""
              )}
            </span>

            <span className="bag-status">
              {checked[product.id]
                ? "Selected for enquiry"
                : "Add to selection"}
            </span>
          </label>
        ))}

        <button
          className="btn primary full"
          type="button"
          disabled={busy}
          onClick={addSelected}
        >
          {busy
            ? "Adding selected items…"
            : "Add selected items"}
        </button>

        {selectedMessage && (
          <p
            style={{
              fontSize: 11,
              margin: "10px 0 0",
              color: "#657e00",
              fontWeight: 800,
            }}
          >
            {selectedMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default function HomeStorefront({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [quick, setQuick] =
    useState<Product | null>(null);

  const [tab, setTab] =
    useState("all");

  const orderedCategories =
    useMemo(() => {
      return [
        "sports",
        "gym-active",
        "leather",
        "fashion",
      ]
        .map((slug) =>
          categories.find(
            (category) =>
              category.slug === slug
          )
        )
        .filter(Boolean) as Category[];
    }, [categories]);

  const filtered =
    tab === "all"
      ? products
      : products.filter(
          (product) =>
            product.category.slug === tab
        );

  const sports =
    products.filter(
      (product) =>
        product.category.slug ===
        "sports"
    );

  const gym =
    products.filter(
      (product) =>
        product.category.slug ===
        "gym-active"
    );

  const lifestyle =
    products.filter((product) =>
      [
        "leather",
        "fashion",
      ].includes(
        product.category.slug
      )
    );

  const featured =
    products
      .filter(
        (product) =>
          product.featured
      )
      .slice(0, 8);

  const newArrival =
    products.find(
      (product) =>
        product.slug ===
        "xlime-football-custom-kit"
    ) || sports[0];

  return (
    <>
      <HeroCarousel />

      <ContactStrip />

      {/* SHOP BY CATEGORY */}
      <section className="section light-panel">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{
                  color: "#657e00",
                }}
              >
                Simple discovery
              </span>

              <h2 className="h2">
                Shop by category
              </h2>

              <p
                className="muted"
                style={{
                  maxWidth: 720,
                }}
              >
                Four clear main categories
                with focused sub-categories
                make it easy to find the
                right XLIME product.
              </p>
            </div>

            <Link
              href="/shop"
              className="link"
            >
              Shop all →
            </Link>
          </div>

          <div className="main-category-grid">
            {orderedCategories.map(
              (category) => {
                const fallback =
                  categoryFallback[
                    category.slug
                  ];

                return (
                  <Link
                    className="main-category-card"
                    href={`/shop/${category.slug}`}
                    key={category.id}
                  >
                    <Image
                      src={assetUrl(
                        category.imageUrl ||
                          fallback?.img ||
                          ""
                      )}
                      alt={`XLIME GEAR ${category.name} collection`}
                      fill
                      sizes="(max-width:760px) 50vw, 25vw"
                    />

                    <div className="content">
                      <span className="eyebrow">
                        {category.name}
                      </span>

                      <h3>
                        {category.name}
                      </h3>

                      <p>
                        {category.description ||
                          fallback?.copy}
                      </p>

                      <div className="subcat-chips">
                        {(
                          category
                            .subcategories
                            ?.length
                            ? category.subcategories
                            : fallback?.subs ||
                              []
                        )
                          .slice(0, 4)
                          .map(
                            (
                              subcategory
                            ) => (
                              <span
                                className="subcat-chip"
                                key={
                                  subcategory
                                }
                              >
                                {
                                  subcategory
                                }
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* SPORTS DISCOVERY */}
      <section
        className="section light-panel"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="wrap">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{
                  color: "#657e00",
                }}
              >
                Sports
              </span>

              <h2 className="h2">
                Uniforms & sports goods
              </h2>
            </div>

            <Link
              href="/shop/sports"
              className="link"
            >
              View all sports →
            </Link>
          </div>

          <div className="cat-rail">
            {sportsDiscovery.map(
              ([
                name,
                category,
                subcategory,
                image,
              ]) => (
                <Link
                  className="cat-card"
                  key={name}
                  href={`/shop/${category}/${subcategory}`}
                >
                  <Image
                    src={image}
                    width={320}
                    height={190}
                    alt={`${name} by XLIME GEAR`}
                    sizes="160px"
                  />

                  <strong>
                    {name}
                  </strong>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* NEW & TRENDING */}
      <section
        className="section light-panel"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="wrap">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{
                  color: "#657e00",
                }}
              >
                Across the store
              </span>

              <h2 className="h2">
                New & trending
              </h2>
            </div>

            <Link
              href="/shop"
              className="link"
            >
              View all →
            </Link>
          </div>

          <div className="category-tabs">
            {[
              ["all", "All"],
              ["sports", "Sports"],
              [
                "gym-active",
                "Gym & Active",
              ],
              ["leather", "Leather"],
              ["fashion", "Fashion"],
            ].map(
              ([key, label]) => (
                <button
                  type="button"
                  key={key}
                  className={`category-tab ${
                    tab === key
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTab(key)
                  }
                >
                  {label}
                </button>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <ProductRail
              products={filtered.slice(
                0,
                12
              )}
              onQuick={setQuick}
            />
          </div>
        </div>
      </section>

      {/* NEW ARRIVAL */}
      {newArrival && (
        <section
          className="section dark-zone"
          id="newArrival"
        >
          <div className="wrap">
            <div className="new-arrival-banner">
              <div className="new-arrival-media">
                <Image
                  src={assetUrl(
                    newArrival.imageUrl
                  )}
                  alt={
                    newArrival.altText ||
                    "XLIME GEAR football kit new arrival"
                  }
                  fill
                  sizes="(max-width:760px) 100vw, 55vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="new-arrival-copy">
                <span className="eyebrow">
                  NEW ARRIVAL ⚡ | XLIME
                  GEAR FOOTBALL KIT
                </span>

                <h3>
                  Style. Comfort.
                  <br />
                  Performance.
                </h3>

                <p className="client-copy">
                  Premium quality fabric
                  with a modern athletic
                  fit, designed for maximum
                  flexibility and confidence
                  on and off the pitch.
                </p>

                <ul className="detail-list">
                  <li>
                    Custom designs available
                  </li>

                  <li>
                    Team kits & bulk orders
                    accepted
                  </li>

                  <li>
                    Premium printing &
                    stitching quality
                  </li>
                </ul>

                <div className="hero-actions">
                  <Link
                    href={`/product/${newArrival.slug}`}
                    className="btn primary"
                  >
                    View football kit
                  </Link>

                  <Link
                    href="/team-orders"
                    className="btn"
                  >
                    Start team order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEATHER + FASHION */}
      <section className="section light-panel">
        <div className="wrap">
          <div className="mosaic">
            <article className="promo">
              <Image
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85"
                alt="XLIME GEAR leather jacket collection"
                fill
                sizes="(max-width:760px) 100vw, 60vw"
              />

              <div>
                <span className="eyebrow">
                  Leather
                </span>

                <h3>
                  Built beyond the pitch.
                </h3>

                <p>
                  Leather jackets, wallets,
                  belts, bags and everyday
                  accessories.
                </p>

                <Link
                  href="/shop/leather"
                  className="btn primary sm"
                >
                  Shop leather
                </Link>
              </div>
            </article>

            <article className="promo">
              <Image
                src="/images/official/05_custom_clothing_black_tees.jpg"
                alt="XLIME GEAR fashion hoodies and tees"
                fill
                sizes="(max-width:760px) 100vw, 40vw"
              />

              <div>
                <span className="eyebrow">
                  Fashion
                </span>

                <h3>
                  Off-pitch style.
                </h3>

                <p>
                  Hoodies, tees, joggers
                  and lifestyle pieces
                  designed around the XLIME
                  attitude.
                </p>

                <Link
                  href="/shop/fashion"
                  className="btn sm"
                >
                  Shop fashion
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GYM + CUSTOM TEAMS */}
      <section
        className="section light-panel"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="wrap">
          <div className="mosaic">
            <article className="promo">
              <Image
                src="/images/official/09_black_tracksuit_premium_quality.jpg"
                alt="XLIME GEAR gym and activewear"
                fill
                sizes="(max-width:760px) 100vw, 60vw"
              />

              <div>
                <span className="eyebrow">
                  Gym & Active
                </span>

                <h3>
                  Train in XLIME.
                </h3>

                <p>
                  Gymwear, activewear, bags
                  and training apparel.
                </p>

                <Link
                  href="/shop/gym-active"
                  className="btn primary sm"
                >
                  Shop gym & active
                </Link>
              </div>
            </article>

            <article className="promo">
              <Image
                src="/images/official/11_black_green_custom_kit.jpg"
                alt="XLIME GEAR custom team kits"
                fill
                sizes="(max-width:760px) 100vw, 40vw"
              />

              <div>
                <span className="eyebrow">
                  Custom Teams
                </span>

                <h3>
                  Your team. Your kit.
                </h3>

                <p>
                  Custom colours, names,
                  numbers and team orders
                  with direct WhatsApp
                  support.
                </p>

                <Link
                  href="/custom-kits"
                  className="btn sm"
                >
                  Design your kit
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SPORTS PRODUCTS */}
      <section className="section dark-zone">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                Fresh drops
              </span>

              <h2 className="h2">
                Sports & team uniforms
              </h2>
            </div>

            <Link
              href="/shop/sports"
              className="link"
            >
              View all sports →
            </Link>
          </div>

          <ProductRail
            products={sports}
            onQuick={setQuick}
          />
        </div>
      </section>

      {/* GYM PRODUCTS */}
      <section className="section light-panel">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{
                  color: "#657e00",
                }}
              >
                Gym & Active
              </span>

              <h2 className="h2">
                Train. Move. Recover.
              </h2>
            </div>

            <Link
              href="/shop/gym-active"
              className="link"
            >
              View gym & active →
            </Link>
          </div>

          <ProductRail
            products={gym}
            onQuick={setQuick}
          />
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="section dark-zone">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                Leather & Fashion
              </span>

              <h2 className="h2">
                Off-pitch essentials
              </h2>
            </div>

            <Link
              href="/shop/leather"
              className="link"
            >
              View collections →
            </Link>
          </div>

          <ProductRail
            products={lifestyle}
            onQuick={setQuick}
          />
        </div>
      </section>

      {/* CUSTOM KIT */}
      <section className="section dark-zone">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                Live customisation
              </span>

              <h2 className="h2">
                Custom kit studio
              </h2>
            </div>
          </div>

          <CustomKitStudio />
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section light-panel">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{
                  color: "#657e00",
                }}
              >
                Popular across categories
              </span>

              <h2 className="h2">
                Best sellers
              </h2>
            </div>

            <Link
              href="/shop"
              className="link"
            >
              View all →
            </Link>
          </div>

          <ProductRail
            products={(
              featured.length
                ? featured
                : products
            ).slice(0, 8)}
            onQuick={setQuick}
          />
        </div>
      </section>

      {/* TEAM ORDER */}
      <section className="section team-order">
        <div className="wrap copy">
          <span className="eyebrow">
            Clubs • Schools • Academies
          </span>

          <h3>
            Kit out
            <br />
            your whole club.
          </h3>

          <p>
            Custom designs, team kits and
            bulk orders with direct support
            from XLIME GEAR.
          </p>

          <div className="hero-actions">
            <Link
              href="/team-orders"
              className="btn primary"
            >
              Start team order
            </Link>

            <a
              href="https://wa.me/447510926711"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BAG BUILDER */}
      <section className="section light-panel home-bag-builder-section">
        <div className="wrap">
          <BagBuilder products={products} />
        </div>
      </section>

      {/* SUPPORT */}
      <section className="section dark-zone">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                Support & Contact
              </span>

              <h2 className="h2">
                Need help choosing?
              </h2>

              <p className="muted">
                DM us for custom orders &
                worldwide inquiries.
              </p>
            </div>
          </div>

          <div className="trust">
            {[
              [
                MessageCircle,
                "WhatsApp",
                "+44 7510 926711",
                "https://wa.me/447510926711",
              ],
              [
                Mail,
                "Email",
                "info@xlimegear.com",
                "mailto:info@xlimegear.com",
              ],
              [
                InstagramIcon,
                "Instagram",
                "@xlimegear",
                "https://www.instagram.com/xlimegear",
              ],
              [
                Globe2,
                "Worldwide inquiries",
                "Custom & bulk orders",
                "/team-orders",
              ],
            ].map(
              ([
                Icon,
                title,
                sub,
                href,
              ]: any) => {
                const external =
                  String(
                    href
                  ).startsWith("http");

                return (
                  <Link
                    href={href}
                    key={title}
                    target={
                      external
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      external
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <em>
                      <Icon size={24} />
                    </em>

                    <div>
                      <b>
                        {title}
                      </b>

                      <span>
                        {sub}
                      </span>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* QUICK VIEW */}
      {quick && (
        <QuickViewModal
          product={quick}
          onClose={() =>
            setQuick(null)
          }
        />
      )}
    </>
  );
}






// "use client";

// import { useMemo, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// import {
//   Globe2,
//   Mail,
//   MessageCircle,
// } from "lucide-react";

// import HeroCarousel from "@/components/home/HeroCarousel";
// import ContactStrip from "@/components/layout/ContactStrip";
// import ProductCard from "@/components/products/ProductCard";
// import QuickViewModal from "@/components/products/QuickViewModal";
// import InstagramIcon from "@/components/icons/InstagramIcon";

// import type { Category, Product } from "@/lib/types";
// import { assetUrl } from "@/lib/api";
// import { useCart } from "@/context/CartContext";

// export default function HomeStorefront({
//   categories,
//   products,
// }: {
//   categories: Category[];
//   products: Product[];
// }) {
//   return (
//     <main>
//       <h1>XLIME GEAR</h1>
//       <p>Categories: {categories.length}</p>
//       <p>Products: {products.length}</p>
//     </main>
//   );
// }
