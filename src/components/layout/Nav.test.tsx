import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Nav from "./Nav";

describe("Nav", () => {
  it("lists every section in the desktop nav", () => {
    render(<Nav />);
    const main = screen.getByRole("navigation", { name: "Main" });
    expect(within(main).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "#experience",
      "#projects",
      "#skills",
      "#education",
      "#contact",
    ]);
  });

  it("opens the mobile menu and closes it when a link is tapped", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    const mobile = screen.getByRole("navigation", { name: "Mobile" });

    await user.click(within(mobile).getByRole("link", { name: "Projects" }));
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("scrolls to the tapped section after the mobile menu has closed", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const user = userEvent.setup();
    render(
      <>
        <Nav />
        <section id="projects" />
      </>
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("navigation", { name: "Mobile" })).getByRole("link", { name: "Projects" }));

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("projects"));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("closes the mobile menu on Escape", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument());
  });

  it("uses a descriptive logo alt text", () => {
    render(<Nav />);
    expect(screen.getByRole("img", { name: "Anup Singh Lodh" })).toHaveAttribute("src", "/assets/logo-asl.png");
  });
});
