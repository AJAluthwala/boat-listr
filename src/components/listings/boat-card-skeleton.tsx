"use client";

import { useResponsiveStyles } from "./hooks/use-responsive-styles";

const shimmerBg =
  "linear-gradient(90deg, #eaf3f9 0%, #f5fafd 50%, #eaf3f9 100%)";

const SkeletonBar = ({
  width,
  height,
  marginBottom
}: {
  width: string;
  height: number;
  marginBottom?: number;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 8,
      background: shimmerBg,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s infinite",
      marginBottom: marginBottom ?? 0
    }}
  />
);

export const BoatCardSkeleton = () => {
  const responsive = useResponsiveStyles();

  return (
    <article
      className="bl-market-card"
      style={{
        borderRadius: responsive.isMobile ? "1rem" : "1.25rem",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid #e1eef5",
        boxShadow: "0 8px 20px rgba(10,61,98,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <div
        style={{
          width: "100%",
          height: responsive.imageHeight,
          background: shimmerBg,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s infinite"
        }}
      />
      <div
        style={{
          padding: responsive.isMobile ? "14px 16px" : "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        <SkeletonBar width="75%" height={responsive.isMobile ? 16 : 20} />
        <SkeletonBar width="40%" height={responsive.isMobile ? 18 : 22} />
        <div
          style={{
            display: "flex",
            gap: responsive.isMobile ? 12 : 22,
            marginTop: 4
          }}
        >
          <SkeletonBar width="22%" height={14} />
          <SkeletonBar width="22%" height={14} />
          <SkeletonBar width="30%" height={14} />
        </div>
      </div>
    </article>
  );
};

export default BoatCardSkeleton;
