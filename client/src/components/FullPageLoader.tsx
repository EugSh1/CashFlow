import { LoaderImage } from "./LoaderImage";

export function FullPageLoader() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center">
            <LoaderImage />
        </div>
    );
}
