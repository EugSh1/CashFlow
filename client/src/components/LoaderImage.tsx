import Image from "next/image";

export default function LoaderImage() {
    return (
        <Image
            width={75}
            height={75}
            src="/loader.svg"
            alt="Loader"
            priority={true}
            loading="eager"
        />
    );
}
