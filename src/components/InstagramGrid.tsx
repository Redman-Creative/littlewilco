import { getInstagramPosts, postImage, postAlt } from "@/lib/instagram";
import { site } from "@/lib/site";

export default async function InstagramGrid() {
  const posts = await getInstagramPosts(6);

  return (
    <section className="section section--sunk">
      <div className="wrap">
        <p className="eyebrow">Lately on Instagram</p>
        <h2>{site.instagramHandle}</h2>

        {posts.length > 0 && (
          <ul className="ig-grid">
            {posts.map((post) => (
              <li key={post.id}>
                <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                  <img src={postImage(post)} alt={postAlt(post)} loading="lazy" />
                  {post.mediaType === "VIDEO" && (
                    <span className="ig-badge" aria-hidden="true">
                      ▶
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}

        <p style={{ marginTop: "var(--space-8)", marginBottom: 0 }}>
          <a className="btn btn--secondary" href={site.instagram} target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </a>
        </p>
      </div>
    </section>
  );
}
