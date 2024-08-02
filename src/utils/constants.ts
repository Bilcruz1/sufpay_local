import { INavList, IServices, ISocials } from "./interfaces";

import instagram_icon from '../assets/icons/instagram_icon.svg'
import web_icon from '../assets/icons/web_icon.svg'
import x_icon from '../assets/icons/x_icon.svg'
import youtube_icon from '../assets/icons/youtube_icon.svg'
import ser_1_icon from '../assets/icons/ser_1_icon.svg'
import ser_2_icon from '../assets/icons/ser_2_icon.svg'
import ser_3_icon from '../assets/icons/ser_3_icon.svg'
import ser_4_icon from '../assets/icons/ser_4_icon.svg'
import ser_5_icon from '../assets/icons/ser_5_icon.svg'
import star_icon from "../assets/icons/star_icon.svg";
import rake_icon from '../assets/icons/rake_icon.svg'
import shield_icon from "../assets/icons/shield_icon.svg";
import serv_1_img from '../assets/img/serv_1_img.png'
import serv_2_img from '../assets/img/serv_2_img.png'
import serv_3_img from '../assets/img/serv_3_img.png'
import serv_4_img from '../assets/img/serv_4_img.png'
import serv_5_img from '../assets/img/serv_5_img.png'
import serv_6_img from '../assets/img/serv_6_img.png'
import serv_7_img from '../assets/img/serv_7_img.png'
import serv_8_img from '../assets/img/serv_8_img.png'
import serv_9_img from '../assets/img/serv_9_img.png'





export const passwordChecks: string[] = [
  "Use 8 or more characters",
  "One Uppercase character",
  "One lowercase character",
  "One special character",
  "One number",
];


export const socails: ISocials[] = [
  {
    title: "instagram",
    link: "https://www.instagram.com/sufpayng",
    icon: instagram_icon,
  },
  {
    title: "website",
    link: "/home",
    icon: web_icon,
  },
  {
    title: "x",
    link: "https://x.com/sufpayng",
    icon: x_icon,
  },
  {
    title: "youtube",
    link: "https://www.youtube.com",
    icon: youtube_icon,
  },
];

export const ourServices: IServices[] = [
  {
    title: "IT Training",
    content:
      "We offer comprehensive IT training programs designed to enhance skills and knowledge in various areas of information technology. Our training services cater to individuals and organizations, helping them stay updated with the latest technological advancements",
    img: serv_1_img,
  },

  {
    title: "Digital Multimedia and Web Design",
    content:
      "Out team of experts provides professional web design and degital multimedia services. From creating visually appealing websites to developing engaging multimedia content we help businessws westablish a strong online pressence",
    img: serv_2_img,
  },

  {
    title: "Computer Sales",
    content:
      "As agents for foreign companies, we offer a wide range of computers and related equipment. Our sales services are complemented by expert advice and support, ensuring our clients find the right products to meet their needs",
    img: serv_3_img,
  },

  {
    title: "Software and Internet Services",
    content:
      "SufPay provides a variety of software solutions and internet services, including outsourcing, capacity building, and syndicated financing agreements. We cater to the diverse needs of our clients, offering customized solutions that drive efficiency and growth",
    img: serv_4_img,
  },

  {
    title: "Security Solutions",
    content:
      "Procurement and Supply: We source high-quality tactical equipment from reputable manufacturers, ensuring compliance with international standards and regulations. Our offerings include body armor, helmets, tactical gloves, and boots, tailored to meet specific client requirements",
    img: serv_5_img,
  },

  {
    title: "Professional Installation Services",
    content:
      "Our team conducts on-site assessments to determine optimal equipment placement and integration with existing security systems. We ensure that all installations enhance operational efficiency and provide maximum protection",
    img: serv_6_img,
  },

  {
    title: "Maintenance",
    content:
      "We provide regular scheduled maintenance to ensure the functionality and longevity of your equipment. Our services include 24/7 technical support and emergency repair services, with comprehensive maintenance contracts tailored to client needs",
    img: serv_7_img,
  },

  {
    title: "Personal Protective Equipment (PPE)",
    content:
      "We offer a wide range of PPE, including body armor, helmets, tactical gloves, and boots, to ensure the safety and protection of our clients",
    img: serv_8_img,
  },

  {
    title: "Transportation and Mobility",
    content:
      "Our offerings include armored vehicles, tactical bikes, ATVs, and UAVs for reconnaissance, providing robust solutions for transportation and mobility needs.",
    img: serv_9_img,
  },
];

export const whatWeDo = [
  {
    icon: ser_1_icon,
    title: "Digital Payment Solutions",
    description:
      "SufPay facilitates seamless electronic payments and collections, allowing users to make and receive payments effortlessly.",
  },
  {
    icon: ser_2_icon,
    title: "Simplified Payroll Management",
    description:
      "Streamline your organization's payroll process with SufPay's automated salary disbursements, tax calculations, and deductions.",
  },
  {
    icon: ser_3_icon,
    title: "Unified Financial Management",
    description:
      "SufPay integrates seamlessly with various banking systems and financial institutions, offering a unified platform for a diverse range of financial activities.",
  },
  {
    icon: ser_4_icon,
    title: "Government and Corporate Solutions",
    description:
      "Government agencies and corporate entities can leverage SufPay's platform for efficient public fund management, collections, and disbursements.",
  },
  {
    icon: ser_5_icon,
    title: "Mobile App (In Development)",
    description:
      "Our forthcoming mobile app will be a one-stop shop for financial services, including bill payments, fund transfers, mobile wallet top-ups, and more.",
  },
];

export const aboutUs = [
  {
    title: "Our Company Overview",
    content:
      "SufPay stands at the pinnacle of financial technology innovation in Nigeria, committed to transforming how digital transactions are conducted. Our mission encompasses not just payment solutions but also the delivery of a wide array of ICT services, including the provision of digital communication devices, networking solutions, ISP, and telecommunication support. We are steadfast in our dedication to regulatory compliance and excellence in customer service.",
  },

  {
    title: "Our Mission",
    content:
      "At SufPay, our mission is to empower Nigerians with cutting-edge financial technology solutions while offering a comprehensive suite of information and communication technology services and business support. We strive to build trust through exceptional customer service and unwavering adherence to regulations, becoming the catalyst for seamless digital transformation for individuals, businesses, and governments in Nigeria.",
  },

  {
    title: "Our Vision",
    content:
      "Our vision is to become the trusted advisor and one-stop partner for digital transformation, enabling success for individuals, businesses, and governments across Nigeria. We aim to drive sustainable growth and innovation through state-of-the-art financial technology solutions and foster a connected ecosystem that enhances operational efficiency and customer satisfaction across all sectors.",
  },
];

export const navList: INavList[] = [
  {
    title: "home",
    link: "home"
  },
  {
    title: "about us",
    link: "about"
  },
  {
    title: "services",
    link: "services",
  },
  // {
  //   title: "projects",
  //   link: "projects",
  // },
  {
    title: "contact us",
    link: "contact",
  },
];

export const coreValuesContent = [
  {
    icon: star_icon,
    title: "Excellence"
  },

  {
    icon: rake_icon,
    title: "Interity"
  },

  {
    icon: shield_icon,
    title: "Collaboration"
  }
];
