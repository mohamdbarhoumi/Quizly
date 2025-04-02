import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type props ={}

const RecentActivities = () =>{
    return(
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
                <CardDescription>
                    You have played a total of 7 games. 
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[580px] overflow-scroll">
                histories

            </CardContent>

        </Card>
        )
}
export default RecentActivities