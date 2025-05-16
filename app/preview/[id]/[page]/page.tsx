import { Preview } from "./preview";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; page: string }>;
}) {
  const id = (await params).id;
  const page = (await params).page;

  return (
    <>
      <Preview id={id} page={page} />
    </>
  );
}
