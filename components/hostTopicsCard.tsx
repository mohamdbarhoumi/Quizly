import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import CustomWordCloud from "./customWordCloud";

type Props = {}

const HotTopicsCard = (props: Props) => {
    const wordCloudWidth = 800; // Set a fixed width for the word cloud
    const wordCloudHeight = 400; // Set a fixed height for the word cloud

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
                <CardDescription>
                    Click on a topic to start a quiz on it!
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <CustomWordCloud width={wordCloudWidth} height={wordCloudHeight} />
            </CardContent>
        </Card>
    );
}

export default HotTopicsCard;