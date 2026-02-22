import { IconBriefcase, IconMapPin, IconRecharging, IconSearch } from "@tabler/icons-react";

export const dropdownData = [
  {
    title: "Job Title",
    icon: IconSearch,
    options: [
      "Designer",
      "Developer",
      "Product Manager",
      "Marketing Specialist",
      "Data Analyst",
      "Sales Executive",
    ],
  },
  {
    title: "Location",
    icon: IconMapPin,
    options: [
      "Delhi",
      "Pune",
      "Mumbai",
      "Bengaluru",
      "Tokyo",
      "Berlin",
      "New York",
      "London",
    ],
  },
  {
    title: "Experience",
    icon: IconBriefcase,
    options: ["Entry Level", "Intermediate", "Expert"],
  },
  {
    title: "Job Type",
    icon: IconRecharging,
    options: ["Full Time", "Part Time", "Contract", "Freelance"],
  },
];
