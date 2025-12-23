import { LoaderImage } from "./LoaderImage";

export function BlockLoader() {
    return (
        <div className="flex h-45 w-full items-center justify-center bg-secondary/40 rounded-md">
            <LoaderImage />
        </div>
    );
}
