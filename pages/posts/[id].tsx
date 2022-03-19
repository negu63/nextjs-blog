import Head from "next/head";
import Layout from "../../components/layout";
import Date from "../../components/date";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from "next";
import { NOTFOUND } from "dns";

interface PostProps {
  postData: { title: string; date: string; contentHtml: string };
}

export default function Post({ postData }: PostProps) {
  return (
    <Layout>
      <>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  interface NotFoundResult {
    notFound: true;
    revalidate?: number | boolean;
  }

  const notFoundError: NotFoundResult = {
    notFound: true,
  };

  if (params !== undefined) {
    if (typeof params.id === "string") {
      const postData = await getPostData(params.id);
      return {
        props: {
          postData,
        },
      };
    } else {
      return notFoundError;
    }
  } else {
    return notFoundError;
  }
};
