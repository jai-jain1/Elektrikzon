/** Tag for GROQ strings (editor highlighting only; returns the string unchanged). */
const groq = (strings: TemplateStringsArray, ...values: unknown[]) => String.raw({ raw: strings }, ...values);

// Image projection: everything urlFor needs (crop, hotspot, asset id) plus
// the blur placeholder (lqip) and dimensions for layout.
const IMAGE = groq`{
  alt,
  crop,
  hotspot,
  asset->{ _id, url, metadata { lqip, dimensions { width, height, aspectRatio } } }
}`;

export const categoriesQuery = groq`*[_type == "category" && defined(slug.current)] | order(order asc, title asc) {
  "id": _id,
  title,
  titleHi,
  "slug": slug.current,
  description,
  descriptionHi,
  displayStyle,
  coverImage ${IMAGE},
  order
}`;

export const subcategoriesQuery = groq`*[_type == "subcategory" && defined(slug.current)] | order(order asc, title asc) {
  "id": _id,
  title,
  titleHi,
  "slug": slug.current,
  "categorySlug": category->slug.current,
  order
}`;

export const brandsQuery = groq`*[_type == "brand" && defined(slug.current)] | order(name asc) {
  "id": _id,
  name,
  "slug": slug.current
}`;

const PRODUCT = groq`{
  "id": productId.current,
  name,
  nameHi,
  "category": category->{ title, titleHi, "slug": slug.current },
  "subcategory": subcategory->{ title, titleHi, "slug": slug.current },
  "brand": brand->{ name, "slug": slug.current },
  finishes,
  use,
  specs[]{ label, value },
  description,
  descriptionHi,
  images[] ${IMAGE},
  mrp,
  price,
  featured,
  sample,
  inStockNote
}`;

export const productsQuery = groq`*[_type == "product" && defined(productId.current) && defined(category._ref)] | order(featured desc, name asc) ${PRODUCT}`;

export const productBySlugQuery = groq`*[_type == "product" && productId.current == $slug][0] ${PRODUCT}`;

export const productSlugsQuery = groq`*[_type == "product" && defined(productId.current)].productId.current`;

const CAMPAIGN = groq`{
  "id": _id,
  title,
  titleHi,
  "slug": slug.current,
  eyebrow,
  eyebrowHi,
  description,
  descriptionHi,
  heroImage ${IMAGE},
  startsAt,
  endsAt,
  showOnHomepage,
  offerNote,
  offerNoteHi,
  "items": items[]{ "productId": product->productId.current, offerPrice, badge },
  order,
  "active": (!defined(startsAt) || dateTime(startsAt) <= dateTime(now())) && (!defined(endsAt) || dateTime(endsAt) > dateTime(now()))
}`;

/** Campaigns running right now. */
export const activeCampaignsQuery = groq`*[_type == "campaign" && defined(slug.current)
  && (!defined(startsAt) || dateTime(startsAt) <= dateTime(now()))
  && (!defined(endsAt) || dateTime(endsAt) > dateTime(now()))] | order(order asc, startsAt desc) ${CAMPAIGN}`;

/** One campaign by web address, running or not (ended pages say so). */
export const campaignBySlugQuery = groq`*[_type == "campaign" && slug.current == $slug][0] ${CAMPAIGN}`;

export const campaignSlugsQuery = groq`*[_type == "campaign" && defined(slug.current)].slug.current`;

export const reelsQuery = groq`*[_type == "reel" && defined(postUrl) && defined(cover.asset)] | order(order asc, _createdAt desc) {
  "id": _id,
  title,
  caption,
  postUrl,
  cover ${IMAGE},
  "productIds": products[]->productId.current,
  order
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0] {
  businessName,
  whatsappNumber,
  phone,
  email,
  address,
  postalCode,
  mapsUrl,
  openingHours,
  instagramUrl,
  instagramHandle,
  gstNumber,
  upiId,
  upiPayeeName,
  orderNote,
  brandsStocked,
  strongestLines,
  deliveryAreas,
  deliveryPromise,
  quoteResponseTime,
  heroVideoUrl,
  headlines
}`;
