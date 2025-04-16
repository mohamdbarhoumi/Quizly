import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomWordCloud from "./customWordCloud";
import { prisma } from "@/lib/db";
import { TopicType } from "@/components/customWordCloud.types";

const HotTopicsCard = async () => {
  const topics = await prisma.topicCount.findMany({
    orderBy: {
      count: "desc"
    },
    take: 50
  });

  const formattedTopics: TopicType[] = topics.map((topic: { topic: any; count: any; }) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className="col-span-4 h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Trending Topics</CardTitle>
        <CardDescription>
          Click on any topic to begin a new quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center p-4">
        {formattedTopics.length > 0 ? (
          <CustomWordCloud 
            topics={formattedTopics}
            width={600}
            height={400}
            className="w-full h-full"
          />
        ) : (
          <p className="text-muted-foreground text-center">
            No topics available yet. Start quizzing to generate trends!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;