import PieCard from "./PieCard";
import LineStatsCard from "./LineStatsCard";
import {useState} from "react";
import {useLineStatistics} from "../hooks/useLineStatistics";
import {useParams} from "react-router-dom";

type Provider = {
    providerCode: string;
}

interface LineStatistics {

}

export const StatisticsForProvider = () => {

    const { providerCode } = useParams<Provider>();
    useLineStatistics(providerCode);

    const [daysValid, setDaysValid] = useState<number>(180);
    const [selectedSegment, setSelectedSegment] = useState<string>('all');

    return <div></div>
}