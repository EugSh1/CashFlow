import LoaderImage from "./LoaderImage";

export default function BlockLoader() {
    return (
        <div className="flex h-45 w-full items-center justify-center bg-secondary/40 rounded-md">
            <LoaderImage />
        </div>
    );
}
