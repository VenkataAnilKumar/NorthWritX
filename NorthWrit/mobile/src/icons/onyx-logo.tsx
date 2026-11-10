import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/icons/types";

// Paths fill with `currentColor` (RN can't read a CSS var), tinted via the `Icon` color class.
const SvgOnyxLogo = ({ size = 16, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="currentColor"
    {...props}
  >
    
    
    
    
  <Path d="M12 52V12H21L43 38V12H52V52H43L21 26V52Z" fill="currentColor" />
  </Svg>
);

export default SvgOnyxLogo;
