export const sortIcon = (sorting: number) => {
  let def = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 24"
    >
      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
    </svg>
  );
  let down = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 24"
    >
      <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    </svg>
  );
  let up = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 24"
    >
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
  let az = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 24 18"
    >
      <text x="12" y="12" textAnchor="middle">
        AZ
      </text>
    </svg>
  );
  let za = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 24 18"
    >
      <text x="12" y="12" textAnchor="middle">
        ZA
      </text>
    </svg>
  );
  switch (sorting) {
    default:
    case 0:
      return def;
    case 1:
      return (
        <div>
          {az}
          {down}
        </div>
      );
    case 2:
      return (
        <div>
          {za}
          {up}
        </div>
      );
    case 3:
      return down;
    case 4:
      return up;
  }
};
