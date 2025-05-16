import { Preview } from "./[page]/preview";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; page: string }>;
}) {
  const id = (await params).id;

  return (
    <>
      <Preview id={id} />
    </>
  );
}
