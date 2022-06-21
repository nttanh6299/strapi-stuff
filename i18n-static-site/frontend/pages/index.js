import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home({ recipes }) {
  //Get the current locale from router.locale
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div style={{ margin: "20px" }}>
      <h2>{t("recipes")}</h2>
      {recipes.length > 0 &&
        recipes.map((recipe) => {
          return (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`} locale={router.locale}>
              {recipe.attributes.title}
            </Link>
          );
        })}
      <div style={{ marginTop: "20px" }}>
        <Link href="/" locale={router.locale === "en" ? "fr-CA" : "en"}>
          {t("change_locale")}
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => {
  const res = await fetch(`http://localhost:1337/api/recipes?locale=${locale}`);
  const { data } = await res.json();

  return {
    props: {
      recipes: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
