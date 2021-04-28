export default function TestPage() {
    return (
        <>
            <div>This is a test page</div>
            <br />
            <iframe src="/content-a-with-authorizer"></iframe>
            <br />
            <iframe src="/content-b-without-authorizer"></iframe>
        </>
    );
}
