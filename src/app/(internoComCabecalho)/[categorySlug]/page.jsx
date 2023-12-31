import Link from "next/link";
import CategoryService from "@/lib/services/CategoryService";
import { notFound } from "next/navigation";

export default async function Page({ params, searchParams }) {
  const { categorySlug } = params;
  const { after, before } = searchParams;

  const category = await CategoryService.findBySlugWithPosts(
    categorySlug,
    after,
    before
  );

  if (!category) {
    notFound();
  }

  return (
    <>
      <ul className="list-unstyled">
        {category.posts.edges.map((post) => (
          <li key={post.node.postId}>
            <Link
              className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
              href={`/${categorySlug}/${post.node.slug}`}
            >
              {post.node.featuredImage && (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    backgroundImage: `url(${post.node.featuredImage.node.sourceUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}
                ></div>
              )}
              {!post.node.featuredImage && (
                <svg
                  className="bd-placeholder-img"
                  width="96"
                  height="96"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <rect width="100%" height="100%" fill="#777"></rect>
                </svg>
              )}
              <div className="col-lg-8">
                <h3 className="mb-0">{post.node.title}</h3>
                <small className="text-body-secondary">
                  {new Date(post.node.date).toLocaleString("pt-br", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </small>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="blog-pagination" aria-label="Pagination">
        {category.posts.pageInfo.hasNextPage && (
          <Link
            href={`?after=${category.posts.pageInfo.endCursor}`}
            className="btn btn-outline-primary rounded-pill"
          >
            ⬅️ Mais antigos
          </Link>
        )}
        {category.posts.pageInfo.hasPreviousPage && (
          <Link
            href={`?before=${category.posts.pageInfo.startCursor}`}
            className="btn btn-outline-primary rounded-pill"
          >
            Mais recentes ➡️
          </Link>
        )}
      </nav>
    </>
  );
}
