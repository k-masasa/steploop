"use client";

import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ActivityHeatmapProps = {
  activities: Activity[];
};

/**
 * 色味の選定理由:
 * - 緑系グラデーション: GitHub の草と同じで「成長」「達成」を連想させる
 * - 薄い色から濃い色へ: 振り返り回数が多いほど濃くなり、頑張りが視覚化される
 * - #ebedf0 (未活動): 目立ちすぎず、活動日を引き立てる
 */
const customTheme: ThemeInput = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  // 過去 5 ヶ月分のデータを準備 (空の日も含める)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  // activities を Map に変換して高速検索
  const activityMap = new Map(activities.map((a) => [a.date, a]));

  // 日付範囲を埋める
  const filledActivities: Activity[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const existing = activityMap.get(dateStr);

    filledActivities.push(
      existing || {
        date: dateStr,
        count: 0,
        level: 0,
      }
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">振り返りアクティビティ</h2>
      <div className="overflow-x-auto">
        <ActivityCalendar
          data={filledActivities}
          theme={customTheme}
          labels={{
            months: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            weekdays: ["日", "月", "火", "水", "木", "金", "土"],
            legend: {
              less: "少ない",
              more: "多い",
            },
          }}
          showWeekdayLabels
          renderBlock={(block, activity) => (
            <g
              data-tooltip-id="activity-tooltip"
              data-tooltip-content={
                activity.count > 0
                  ? `${activity.date}: ${activity.count} 件の振り返り`
                  : `${activity.date}: 振り返りなし`
              }
            >
              {block}
            </g>
          )}
        />
      </div>
      <ReactTooltip id="activity-tooltip" />
    </div>
  );
}
