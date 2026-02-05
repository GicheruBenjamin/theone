// pages.js
import Component from "./Components.js";
import {
  homepagecontent,
  aboutpagecontent,
  loginpagecontent
} from "./content.js";

function Section(title, lines) {
  return Component("section", {
    children: [
      Component("h2", { text: title }),
      ...lines.map(line =>
        typeof line === "string"
          ? Component("p", { text: line })
          : Component("p", {
              children: Object.entries(line).map(
                ([key, value]) =>
                  Component("a", {
                    text: `${key}: ${value}`,
                    attributes: { href: value, target: "_blank" }
                  })
              )
            })
      )
    ]
  });
}

export function HomePage(container) {
  container.append(
    Section("Home", homepagecontent.hero),
    Section("About", homepagecontent.about),
    Section("Contact", homepagecontent.contact)
  );
}

export function AboutPage(container) {
  container.append(
    Section("About TheOne", aboutpagecontent.hero),
    Section("More About TheOne", aboutpagecontent.about)
  );
}

export function LoginPage(container) {
  container.append(
    Section("Info", loginpagecontent.hero)
  );
}
