import type { StructureResolver } from "sanity/structure";
import { BoxIcon, FolderIcon, InfoIcon, PlayIcon, SettingsIcon, SubfolderIcon, TagIcon } from "./lib/icons";
import { StartHere } from "./components/StartHere";

// Left menu order for the shop owner:
// Start here, Site settings, Categories, Subcategories, Brands,
// Products by category, All products, Reels.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("ElektrikZone")
    .items([
      S.listItem()
        .title("Start here")
        .icon(InfoIcon)
        .child(S.component(StartHere).id("start-here").title("Start here")),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(SettingsIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.documentTypeListItem("campaign").title("Campaigns and offers").icon(TagIcon),
      S.divider(),
      S.documentTypeListItem("category").title("Categories").icon(FolderIcon),
      S.documentTypeListItem("subcategory").title("Subcategories").icon(SubfolderIcon),
      S.documentTypeListItem("brand").title("Brands").icon(TagIcon),
      S.divider(),
      S.listItem()
        .title("Products by category")
        .icon(FolderIcon)
        .child(
          S.documentTypeList("category")
            .title("Choose a category")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .child((categoryId) =>
              S.documentList()
                .title("Products")
                .schemaType("product")
                .filter('_type == "product" && category._ref == $categoryId')
                .params({ categoryId })
                .defaultOrdering([{ field: "name", direction: "asc" }])
                .initialValueTemplates([S.initialValueTemplateItem("product-in-category", { categoryId })]),
            ),
        ),
      S.documentTypeListItem("product").title("All products").icon(BoxIcon),
      S.divider(),
      S.documentTypeListItem("reel").title("Reels").icon(PlayIcon),
    ]);
