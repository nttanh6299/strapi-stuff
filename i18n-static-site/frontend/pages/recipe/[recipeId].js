import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ReactMarkdown from "react-markdown";

export default function RecipeDetail({ recipe }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { title, instructions, header_image } = recipe.attributes;

  return (
    <div style={{ margin: "20px" }}>
      {recipe && (
        <div>
          <img
            src={`http://localhost:1337${header_image.data.attributes.url}`}
            width={200}
            height={200}
          />
          <h2>{title}</h2>
          <ReactMarkdown>{instructions}</ReactMarkdown>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <Link href="/" locale={router.locale}>
          {t("go_back")}
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale, params }) => {
  const { recipeId } = params;
  const res = await fetch(
    `http://localhost:1337/api/recipes/${recipeId}?populate=*`
  );
  const { data } = await res.json();

  return {
    props: {
      recipe: data,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
