import { Card, CardContent } from "@/components/ui/card";
import type { Feature } from "@/types";

type Props = {
    feature: Feature;
};

export function FeatureCard({ feature }: Readonly<Props>) {
    const { title, description, Icon } = feature;

    return (
        <Card>
            <CardContent>
                <div className="bg-accent p-2 w-min rounded-md mb-3 aspect-square">
                    <Icon />
                </div>
                <h3 className="mb-1 font-semibold text-xl">{title}</h3>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}
