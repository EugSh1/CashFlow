import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { expenseFormatter } from "@/utils/expenseFormatter";
import { TrendingDown, TrendingUp } from "lucide-react";

type Props = {
    title: string;
    amount: number;
    trends: "up" | "down";
    description: string;
    percents: number;
    lowerInfo: string;
    className?: string;
    showTrends?: boolean;
};

export function InfoCards({
    title,
    amount,
    description,
    percents,
    trends,
    lowerInfo,
    className,
    showTrends = true
}: Readonly<Props>) {
    const TrendsIcon = trends === "up" ? TrendingUp : TrendingDown;

    return (
        <Card className={cn("card-gradient", className)}>
            <CardHeader className={cn("flex justify-between")}>
                <span className="font-medium">{title}</span>
                {showTrends && (
                    <Badge variant="outline">
                        <TrendsIcon />
                        {percents}%
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                    {expenseFormatter.format(amount)}
                </CardTitle>
            </CardContent>
            {showTrends && (
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {description} <TrendsIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">{lowerInfo}</div>
                </CardFooter>
            )}
        </Card>
    );
}
