type Post = {
  slug: string;
  title: string;
};

let posts = [
  {
    slug: "my-first-post",
    title: "My First Post",
  },
  {
    slug: "90s-mixtape",
    title: "A Mixtape I Made Just For You",
  },
];

export async function getPosts(): Promise<Array<Post>> {
  return posts;
}
