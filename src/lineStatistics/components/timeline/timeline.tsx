import React from "react";
import style from "./timeline.module.scss";
import { PeriodValidity, Timetable } from "../../lineStatistics.types";
import { SmallText } from "@entur/typography"
import { useRandomId } from "@entur/utils";

interface Props {
  timetables: Timetable[];
}

export const Timeline = ({ timetables }: Props) => {

  const randomId = useRandomId('timetable-period');

  const getPeriodStyle = (period: PeriodValidity) => ({
    width: `${period.timelineEndPosition - period.timelineStartPosition}%`,
    marginLeft: `${period.timelineStartPosition}%`
  })

  return (
    <div className={style.timelineWrapper}>
      <div className={style.timelineStyle}>
        <div className={style.hrStyle} />
        {timetables.map((timetable, timeTableIndex) =>
          timetable.periods.map((period, periodIndex) => (
            <div
              key={`${randomId}${periodIndex}`}
              className={style.periodLine}
              style={{ marginBottom: timeTableIndex === timetables.length - 1 ? '0' : '2px' }}
            >
              <div
                className={style.periodBlock}
                style={getPeriodStyle(period as PeriodValidity)}
                title={`${timetable.objectId} \n(period: ${period.from} -> ${period.to})`}
              >
                <SmallText className={style.textStyle}>
                  {timetable.objectId}
                </SmallText>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}