import Editor from "@/components/Editor";

export default async function Page({
    params,
}: {
    params: Promise<{ pageId: string }>;
}) {
    const { pageId } = await params;
    return <Editor pageId={pageId} />;
}
