import React from "react";

import { render, screen } from "common/testing";
import { widgetProps } from "common/utils/mock";

import QrCode from "../index";

describe("<QrCode />", () => {
  test("renders without errors", () => {
    render(<QrCode {...widgetProps} content="example" />);

    expect(
      screen.queryByText("widget.common.unconfigured")
    ).not.toBeInTheDocument();
  });

  test("doesn't render if the query is missing", () => {
    render(<QrCode {...widgetProps} content="" />);
    expect(screen.getByText("widget.common.unconfigured")).toBeInTheDocument();
  });
});
