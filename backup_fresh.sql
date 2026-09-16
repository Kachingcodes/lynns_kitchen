--
-- PostgreSQL database dump
--

\restrict mTyAa3TVvmPHSxbr8XgKO5yryoQ4lyV0F7eCYgnAbSFG6HzvquhBToTqPgjJIyH

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: complaint_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.complaint_status AS ENUM (
    'open',
    'resolved'
);


--
-- Name: menu_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.menu_category AS ENUM (
    'starter',
    'main',
    'dessert',
    'sides',
    'drinks'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'preparing',
    'served',
    'paid',
    'cancelled',
    'ready'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'completed',
    'failed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bartender; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bartender (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    name text NOT NULL,
    specialty text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bartender_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bartender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bartender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bartender_id_seq OWNED BY public.bartender.id;


--
-- Name: chef; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chef (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    name text NOT NULL,
    specialty text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chef_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chef_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chef_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chef_id_seq OWNED BY public.chef.id;


--
-- Name: complaint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint (
    id integer NOT NULL,
    order_id integer NOT NULL,
    customer_id integer NOT NULL,
    resolved_by_waiter_id integer,
    description text NOT NULL,
    resolution_status public.complaint_status DEFAULT 'open'::public.complaint_status NOT NULL,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);


--
-- Name: complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaint_id_seq OWNED BY public.complaint.id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: menu_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_item (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    name text NOT NULL,
    category public.menu_category NOT NULL,
    description text,
    price_naira numeric(10,2) NOT NULL,
    avg_prep_minutes integer NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    image_url text,
    CONSTRAINT menu_item_avg_prep_minutes_check CHECK ((avg_prep_minutes >= 0)),
    CONSTRAINT menu_item_price_naira_check CHECK ((price_naira >= (0)::numeric))
);


--
-- Name: menu_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_item_id_seq OWNED BY public.menu_item.id;


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item (
    id integer NOT NULL,
    order_id integer NOT NULL,
    menu_item_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price_naira numeric(10,2) NOT NULL,
    subtotal_naira numeric(12,2) GENERATED ALWAYS AS ((unit_price_naira * (quantity)::numeric)) STORED,
    prep_start_time timestamp with time zone,
    prep_end_time timestamp with time zone,
    CONSTRAINT order_item_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_item_unit_price_naira_check CHECK ((unit_price_naira >= (0)::numeric))
);


--
-- Name: order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_item_id_seq OWNED BY public.order_item.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    customer_id integer NOT NULL,
    waiter_id integer,
    chef_id integer,
    bartender_id integer,
    table_number text NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    order_datetime timestamp with time zone DEFAULT now() NOT NULL,
    estimated_wait_minutes integer DEFAULT 0 NOT NULL,
    actual_wait_minutes integer,
    served_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    preparing_started_at timestamp with time zone
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    id integer NOT NULL,
    order_id integer NOT NULL,
    received_by_waiter_id integer,
    amount_naira numeric(12,2) NOT NULL,
    method text DEFAULT 'cash'::text NOT NULL,
    status public.payment_status DEFAULT 'completed'::public.payment_status NOT NULL,
    is_pretend boolean DEFAULT true NOT NULL,
    paid_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_amount_naira_check CHECK ((amount_naira >= (0)::numeric))
);


--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;


--
-- Name: rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rating (
    id integer NOT NULL,
    order_id integer NOT NULL,
    customer_id integer NOT NULL,
    rating_value integer NOT NULL,
    comment text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rating_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);


--
-- Name: rating_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rating_id_seq OWNED BY public.rating.id;


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant (
    id integer NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurant_id_seq OWNED BY public.restaurant.id;


--
-- Name: waiter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waiter (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    name text NOT NULL,
    phone text,
    shift_schedule text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: waiter_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.waiter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: waiter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.waiter_id_seq OWNED BY public.waiter.id;


--
-- Name: bartender id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bartender ALTER COLUMN id SET DEFAULT nextval('public.bartender_id_seq'::regclass);


--
-- Name: chef id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chef ALTER COLUMN id SET DEFAULT nextval('public.chef_id_seq'::regclass);


--
-- Name: complaint id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint ALTER COLUMN id SET DEFAULT nextval('public.complaint_id_seq'::regclass);


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: menu_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item ALTER COLUMN id SET DEFAULT nextval('public.menu_item_id_seq'::regclass);


--
-- Name: order_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item ALTER COLUMN id SET DEFAULT nextval('public.order_item_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);


--
-- Name: rating id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating ALTER COLUMN id SET DEFAULT nextval('public.rating_id_seq'::regclass);


--
-- Name: restaurant id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant ALTER COLUMN id SET DEFAULT nextval('public.restaurant_id_seq'::regclass);


--
-- Name: waiter id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiter ALTER COLUMN id SET DEFAULT nextval('public.waiter_id_seq'::regclass);


--
-- Data for Name: bartender; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bartender (id, restaurant_id, name, specialty, phone, created_at) FROM stdin;
1	1	Nengi	Cocktails	09022088424	2026-09-05 14:40:22.942949+01
2	1	Kolofah	Mocktails	08034572341	2026-09-05 14:40:22.942949+01
3	2	Tari	Local brews	08077765432	2026-09-05 14:40:22.942949+01
4	3	Olamide Balogun	Classic Cocktails	08032345678	2026-09-16 01:17:37.650871+01
5	3	Nkiru Okeke	Signature Cocktails	08123456789	2026-09-16 01:17:37.650871+01
6	3	Yusuf Ibrahim	Mocktails & Fresh Juices	07034567890	2026-09-16 01:17:37.650871+01
7	3	Adaobi Eze	Wine & Champagne Service	08045678901	2026-09-16 01:17:37.650871+01
8	3	Kunle Adeyemi	Whiskey & Bourbon	08156789012	2026-09-16 01:17:37.650871+01
9	3	Fatima Abdullahi	Cocktail Mixology	07067890123	2026-09-16 01:17:37.650871+01
10	3	Chukwuemeka Obi	Craft Cocktails	08078901234	2026-09-16 01:17:37.650871+01
11	3	Tosin Afolabi	Tropical & Tiki Drinks	08189012345	2026-09-16 01:17:37.650871+01
12	3	Blessing Udo	Non-Alcoholic Beverages	07090123456	2026-09-16 01:17:37.650871+01
13	3	Emmanuel Asare	Premium Spirits & Cocktails	08011234567	2026-09-16 01:17:37.650871+01
\.


--
-- Data for Name: chef; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chef (id, restaurant_id, name, specialty, phone, created_at) FROM stdin;
1	1	Hassan	Grills	09045768922	2026-09-05 14:40:22.942949+01
2	1	Abike	Continental	08134758911	2026-09-05 14:40:22.942949+01
3	1	Essien	Noodles	07054628833	2026-09-05 14:40:22.942949+01
4	1	Yinka	Wraps	09098764523	2026-09-05 14:40:22.942949+01
5	2	Ovie	Soups	08066654321	2026-09-05 14:40:22.942949+01
6	3	Chinedu Okafor	Nigerian Fusion Cuisine	08031245678	2026-09-16 01:16:23.871132+01
7	3	Amaka Eze	Pastry & Desserts	08124567890	2026-09-16 01:16:23.871132+01
8	3	Tunde Adebayo	Grilled Meats & Suya	07035678912	2026-09-16 01:16:23.871132+01
9	3	Zainab Bello	Northern Nigerian Cuisine	08046789123	2026-09-16 01:16:23.871132+01
10	3	Kelechi Nwosu	Seafood & Coastal Cuisine	08157891234	2026-09-16 01:16:23.871132+01
11	3	Damilare Ogunyemi	Modern African Cuisine	07068912345	2026-09-16 01:16:23.871132+01
12	3	Ifeoma Nnamani	Italian & Mediterranean Cuisine	08079123456	2026-09-16 01:16:23.871132+01
13	3	Abdul Malik Sani	Asian Fusion Cuisine	08181234567	2026-09-16 01:16:23.871132+01
14	3	Esther Mensah	Bakery & Artisan Bread	07092345678	2026-09-16 01:16:23.871132+01
15	3	Femi Alade	Contemporary Nigerian Cuisine	08013456789	2026-09-16 01:16:23.871132+01
\.


--
-- Data for Name: complaint; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint (id, order_id, customer_id, resolved_by_waiter_id, description, resolution_status, submitted_at, resolved_at) FROM stdin;
1	2	2	\N	Order is taking too long	open	2026-08-21 15:55:00+01	\N
2	4	4	3	Waiter was sluggish	resolved	2026-08-21 18:33:00+01	2026-08-21 18:40:00+01
3	5	7	\N	Food is bad	resolved	2026-09-05 17:58:13.906362+01	2026-09-06 01:33:50.467709+01
4	14	16	25	Order is taking too long	resolved	2026-09-16 01:51:51.00555+01	2026-09-16 01:52:38.737755+01
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer (id, name, phone, email, created_at) FROM stdin;
1	Nnaemeka	0902208315	nnaemeka@gmail.com	2026-09-05 14:40:22.942949+01
2	Chukwuma	08185025406	chukwuma@gmail.com	2026-09-05 14:40:22.942949+01
3	Kachi	09038218812	kachi@hotmail.com	2026-09-05 14:40:22.942949+01
4	Amarachi	07098417390	amarachi@yahoo.com	2026-09-05 14:40:22.942949+01
7	Queen	\N	\N	2026-09-05 17:54:22.296291+01
8	Alex	\N	\N	2026-09-05 18:12:15.637121+01
9	Samson	\N	\N	2026-09-05 19:50:18.551237+01
10	King	\N	\N	2026-09-05 23:39:03.850377+01
11	Grace	\N	\N	2026-09-06 00:32:11.251997+01
12	mekx	\N	\N	2026-09-06 03:26:49.022475+01
13	Alex	\N	\N	2026-09-06 04:46:20.910478+01
14	musa	\N	\N	2026-09-06 12:42:27.434876+01
15	Indigo	\N	\N	2026-09-16 01:11:10.839043+01
16	Yellow	\N	\N	2026-09-16 01:18:14.921348+01
\.


--
-- Data for Name: menu_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu_item (id, restaurant_id, name, category, description, price_naira, avg_prep_minutes, is_available, created_at, image_url) FROM stdin;
1	1	Beef Suya	starter	Grilled beef skewers with yaji spice	3000.00	15	t	2026-09-05 14:40:22.942949+01	\N
2	1	Peppered Snails	starter	Snails sauteed in hot pepper sauce	3500.00	20	t	2026-09-05 14:40:22.942949+01	\N
3	1	Spring Rolls	starter	Crispy vegetable spring rolls, 4 pieces	1500.00	10	t	2026-09-05 14:40:22.942949+01	\N
4	1	Fish Roll	starter	Pastry-wrapped fish roll	1800.00	12	t	2026-09-05 14:40:22.942949+01	\N
5	1	Meat Pie	starter	Flaky pastry filled with minced meat	1600.00	12	t	2026-09-05 14:40:22.942949+01	\N
6	1	Chicken Wings	starter	Grilled chicken wings, 6 pieces	2800.00	18	t	2026-09-05 14:40:22.942949+01	\N
7	1	Shawarma	main	Seasoned diced meat and veggie wrap	7000.00	20	t	2026-09-05 14:40:22.942949+01	\N
8	1	Jollof Rice	main	Smoky party jollof with fried plantain	4500.00	25	t	2026-09-05 14:40:22.942949+01	\N
9	1	Egusi Soup & Pounded Yam	main	Melon-seed soup with pounded yam	5500.00	30	t	2026-09-05 14:40:22.942949+01	\N
10	1	Fried Rice & Chicken	main	Vegetable fried rice with grilled chicken	5000.00	25	t	2026-09-05 14:40:22.942949+01	\N
11	1	Native Rice & Fish	main	Palm-oil native rice with grilled fish	5200.00	28	t	2026-09-05 14:40:22.942949+01	\N
12	1	Yam Porridge (Asaro)	main	Mashed yam porridge with palm oil sauce	4200.00	25	t	2026-09-05 14:40:22.942949+01	\N
13	1	Chin Chin	dessert	Sweet fried pastry cubes	1500.00	5	t	2026-09-05 14:40:22.942949+01	\N
14	1	Puff Puff	dessert	Sweet fried dough balls	1200.00	8	t	2026-09-05 14:40:22.942949+01	\N
15	1	Banana Fritters	dessert	Deep-fried sweet banana fritters	1800.00	10	t	2026-09-05 14:40:22.942949+01	\N
16	1	Ice Cream Sundae	dessert	Vanilla ice cream with toppings	2500.00	5	t	2026-09-05 14:40:22.942949+01	\N
17	1	Coconut Chips	dessert	Sweet toasted coconut chips	1000.00	5	t	2026-09-05 14:40:22.942949+01	\N
18	1	Bread Pudding	dessert	Warm spiced bread pudding	1700.00	10	t	2026-09-05 14:40:22.942949+01	\N
19	1	French Fries	sides	Fried potato wedges with ketchup	2500.00	10	t	2026-09-05 14:40:22.942949+01	\N
20	1	Fried Plantain	sides	Sweet fried plantain (dodo)	2000.00	10	t	2026-09-05 14:40:22.942949+01	\N
21	1	Moin Moin	sides	Steamed bean pudding	1500.00	15	t	2026-09-05 14:40:22.942949+01	\N
22	1	Coleslaw	sides	Cabbage and carrot slaw	1500.00	5	t	2026-09-05 14:40:22.942949+01	\N
23	1	Sweet Potato Fries	sides	Fried sweet potato wedges	2000.00	10	t	2026-09-05 14:40:22.942949+01	\N
24	1	Mixed Vegetable Salad	sides	Fresh mixed vegetable salad	1600.00	8	t	2026-09-05 14:40:22.942949+01	\N
25	1	Zobo	drinks	Spiced hibiscus cordial, served cold	2000.00	5	t	2026-09-05 14:40:22.942949+01	\N
26	1	Chapman	drinks	House cocktail mocktail, citrus & bitters	2500.00	6	t	2026-09-05 14:40:22.942949+01	\N
27	1	Fresh Watermelon Juice	drinks	Chilled fresh watermelon juice	2000.00	5	t	2026-09-05 14:40:22.942949+01	\N
28	1	Malt Drink	drinks	Chilled malt beverage	1200.00	2	t	2026-09-05 14:40:22.942949+01	\N
29	1	Pineapple Juice	drinks	Chilled fresh pineapple juice	2000.00	5	t	2026-09-05 14:40:22.942949+01	\N
30	1	Coconut Water	drinks	Fresh chilled coconut water	1500.00	3	t	2026-09-05 14:40:22.942949+01	\N
31	2	Samosa Platter	starter	Fried pastry parcels with spiced filling	2000.00	10	t	2026-09-05 14:40:22.942949+01	\N
32	2	Chicken Suya Skewers	starter	Grilled chicken skewers with yaji spice	3200.00	15	t	2026-09-05 14:40:22.942949+01	\N
33	2	Pepper Soup	main	Goat meat pepper soup	5000.00	30	t	2026-09-05 14:40:22.942949+01	\N
34	2	Ofada Rice & Ayamase	main	Local rice with spicy pepper sauce	4800.00	28	t	2026-09-05 14:40:22.942949+01	\N
35	2	Coconut Candy	dessert	Chewy coconut and sugar candy	1000.00	5	t	2026-09-05 14:40:22.942949+01	\N
36	2	Fruit Salad	dessert	Mixed seasonal fruit salad	2000.00	5	t	2026-09-05 14:40:22.942949+01	\N
37	2	Garden Salad	sides	Fresh mixed garden salad	1800.00	8	t	2026-09-05 14:40:22.942949+01	\N
38	2	Yam Chips	sides	Fried yam chips with pepper sauce	2200.00	12	t	2026-09-05 14:40:22.942949+01	\N
39	2	Palm Wine	drinks	Fresh tapped palm wine	1500.00	3	t	2026-09-05 14:40:22.942949+01	\N
40	2	Tiger Nut Milk	drinks	Chilled kunun aya (tiger nut milk)	1800.00	5	t	2026-09-05 14:40:22.942949+01	\N
41	3	Suya Chicken Skewers	starter	Tender grilled chicken skewers coated in aromatic Nigerian suya spice and served with a creamy peanut dip.	5500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/suya-chicken-skewers.png
42	3	Jollof Arancini	starter	Crispy golden rice balls inspired by smoky Nigerian jollof, served with a rich roasted pepper sauce.	6500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/jollof-arancini.png
43	3	Peppered Prawn Tacos	starter	Soft tacos filled with spicy peppered prawns, fresh slaw and a bright citrus dressing.	7500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/peppered-prawn-tacos.png
44	3	Spiced Calamari	starter	Lightly battered calamari seasoned with bold African spices and served with lemon aioli.	7000.00	14	t	2026-09-09 16:51:10.333889+01	/images/menu/spiced-calamari.png
45	3	Suya Prawn Tempura	starter	Crispy tempura prawns dusted with Nigerian suya seasoning and served with a signature house dip.	7500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/suya-prawn-tempura.png
46	3	Smoky Jollof Risotto	main	A creamy Italian-style risotto infused with the bold, smoky flavours of Nigerian party jollof.	9500.00	25	t	2026-09-09 16:51:10.333889+01	/images/menu/smoky-jollof-risotto.png
47	3	Suya-Spiced Steak	main	Juicy grilled steak coated in signature suya spice, served with silky plantain pur‚e and seasonal vegetables.	16000.00	30	t	2026-09-09 16:51:10.333889+01	/images/menu/suya-spiced-steak.png
48	3	Peppered Salmon	main	Pan-seared salmon finished with a rich Nigerian pepper sauce and served with fragrant herb rice.	15000.00	25	t	2026-09-09 16:51:10.333889+01	/images/menu/peppered-salmon.png
49	3	Suya Ramen	main	A rich and comforting noodle broth with suya-spiced beef, fresh vegetables and a perfectly cooked egg.	11000.00	22	t	2026-09-09 16:51:10.333889+01	/images/menu/suya-ramen.png
50	3	Truffle Mushroom Pasta	main	Creamy pasta with wild mushrooms, parmesan, delicate truffle notes and a subtle smoked pepper finish.	13500.00	22	t	2026-09-09 16:51:10.333889+01	/images/menu/truffle-mushroom-pasta.png
51	3	Plantain & Truffle Fries	sides	Crispy plantain and potato fries tossed with herbs and a light truffle seasoning.	4500.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/plantain-truffle-fries.png
52	3	Suya Street Corn	sides	Charred sweet corn brushed with spicy suya butter and finished with fresh lime.	4500.00	12	t	2026-09-09 16:51:10.333889+01	/images/menu/suya-street-corn.png
53	3	Smoked Pepper Potato Puree	sides	Creamy mashed potatoes infused with roasted Nigerian peppers and fresh herbs.	4000.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/smoked-pepper-potato-puree.png
54	3	Coconut Jasmine Rice	sides	Fragrant jasmine rice cooked with coconut and delicate aromatics.	4000.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/coconut-jasmine-rice.png
55	3	Parmesan Yam Fries	sides	Crispy yam fries topped with parmesan, herbs and subtle smoked pepper seasoning.	4500.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/parmesan-yam-fries.png
56	3	Plantain Cheesecake	dessert	Creamy baked cheesecake infused with caramelised plantain and finished with a delicate caramel sauce.	6500.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/plantain-cheesecake.png
57	3	Puff-Puff Bread Pudding	dessert	A warm and comforting bread pudding inspired by Nigerian puff-puff, served with smooth vanilla sauce.	5500.00	12	t	2026-09-09 16:51:10.333889+01	/images/menu/puff-puff-bread-pudding.png
58	3	Chocolate Suya Brownie	dessert	Rich dark chocolate brownie with subtle warming spices, served with creamy vanilla ice cream.	6000.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/chocolate-suya-brownie.png
59	3	Coconut Panna Cotta	dessert	Silky coconut panna cotta served with tropical fruit and a delicate passionfruit sauce.	5500.00	18	t	2026-09-09 16:51:10.333889+01	/images/menu/coconut-panna-cotta.png
60	3	Mango Passionfruit Tart	dessert	Buttery pastry filled with smooth mango cream and finished with bright passionfruit.	6000.00	10	t	2026-09-09 16:51:10.333889+01	/images/menu/mango-passionfruit-tart.png
61	3	Lynn's Sunset	drinks	A refreshing signature tropical blend of exotic fruits and bright citrus flavours.	6500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/lynns-sunset.png
62	3	Zobo Mojito	drinks	A refreshing fusion of hibiscus, fresh mint, lime and sparkling soda.	5500.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/zobo-mojito.png
63	3	Pineapple Ginger Fizz	drinks	Fresh pineapple, warming ginger and sparkling soda served over ice.	4000.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/pineapple-ginger-fizz.png
64	3	Passionfruit Cooler	drinks	A chilled tropical blend of passionfruit, citrus and sparkling water.	4000.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/passionfruit-cooler.png
65	3	Mango Sparkler	drinks	Sweet mango, fresh citrus and sparkling soda served ice cold.	4000.00	15	t	2026-09-09 16:51:10.333889+01	/images/menu/mango-sparkler.png
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_item (id, order_id, menu_item_id, quantity, unit_price_naira, prep_start_time, prep_end_time) FROM stdin;
1	1	7	2	7000.00	2026-08-21 13:02:00+01	2026-08-21 13:24:00+01
2	1	25	1	2000.00	2026-08-21 13:02:00+01	2026-08-21 13:08:00+01
3	2	1	4	3000.00	2026-08-21 15:32:00+01	\N
4	3	1	3	3000.00	2026-08-21 16:03:00+01	\N
5	4	19	2	2500.00	2026-08-21 18:05:00+01	2026-08-21 18:33:00+01
6	5	1	1	3000.00	\N	\N
7	5	6	1	2800.00	\N	\N
8	6	1	1	3000.00	\N	\N
9	6	6	1	2800.00	\N	\N
10	6	4	1	1800.00	\N	\N
11	7	1	1	3000.00	\N	\N
12	7	6	1	2800.00	\N	\N
13	7	26	1	2500.00	\N	\N
14	7	30	1	1500.00	\N	\N
15	8	1	1	3000.00	\N	\N
16	8	6	1	2800.00	\N	\N
17	9	26	1	2500.00	\N	\N
18	9	30	1	1500.00	\N	\N
19	10	1	1	3000.00	\N	\N
20	10	6	1	2800.00	\N	\N
21	10	4	1	1800.00	\N	\N
22	10	26	1	2500.00	\N	\N
23	10	30	1	1500.00	\N	\N
24	11	1	3	3000.00	\N	\N
25	11	6	1	2800.00	\N	\N
26	11	4	1	1800.00	\N	\N
27	12	1	1	3000.00	\N	\N
28	12	4	1	1800.00	\N	\N
29	12	6	1	2800.00	\N	\N
30	13	42	1	6500.00	\N	\N
31	14	43	1	7500.00	\N	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, restaurant_id, customer_id, waiter_id, chef_id, bartender_id, table_number, status, order_datetime, estimated_wait_minutes, actual_wait_minutes, served_at, created_at, preparing_started_at) FROM stdin;
1	1	1	4	2	1	T01	paid	2026-08-21 13:00:00+01	25	25	2026-08-21 13:25:00+01	2026-09-05 14:40:22.942949+01	\N
4	1	4	3	3	1	T18	paid	2026-08-21 18:00:00+01	30	35	2026-08-21 18:35:00+01	2026-09-05 14:40:22.942949+01	\N
5	1	7	\N	\N	\N	18	pending	2026-09-05 17:54:22.296291+01	18	\N	\N	2026-09-05 17:54:22.296291+01	\N
3	1	3	2	4	2	T13	paid	2026-08-21 16:00:00+01	15	\N	\N	2026-09-05 14:40:22.942949+01	\N
8	1	10	3	3	\N	6	paid	2026-09-05 23:39:03.850377+01	18	18	\N	2026-09-05 23:39:03.850377+01	2026-09-05 23:46:20.995829+01
6	1	8	4	1	\N	8	paid	2026-09-05 18:12:15.637121+01	18	18	\N	2026-09-05 18:12:15.637121+01	\N
2	1	2	1	4	2	T20	served	2026-08-21 15:30:00+01	20	\N	\N	2026-09-05 14:40:22.942949+01	\N
9	1	11	1	\N	1	3	paid	2026-09-06 00:32:11.251997+01	6	6	\N	2026-09-06 00:32:11.251997+01	2026-09-06 00:32:30.687312+01
7	1	9	1	1	1	16	paid	2026-09-05 19:50:18.551237+01	18	18	\N	2026-09-05 19:50:18.551237+01	2026-09-05 23:52:49.596566+01
10	1	12	\N	\N	\N	12	pending	2026-09-06 03:26:49.022475+01	18	\N	\N	2026-09-06 03:26:49.022475+01	\N
11	1	13	4	2	\N	12	preparing	2026-09-06 04:46:20.910478+01	18	18	\N	2026-09-06 04:46:20.910478+01	2026-09-06 04:46:55.438142+01
12	1	14	2	4	\N	17	served	2026-09-06 12:42:27.434876+01	18	18	\N	2026-09-06 12:42:27.434876+01	2026-09-06 12:45:38.476697+01
14	3	16	25	11	\N	10	paid	2026-09-16 01:18:14.921348+01	15	15	\N	2026-09-16 01:18:14.921348+01	2026-09-16 01:45:44.202867+01
13	3	15	8	6	\N	9	served	2026-09-16 01:11:10.839043+01	15	15	\N	2026-09-16 01:11:10.839043+01	2026-09-16 01:52:27.871345+01
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (id, order_id, received_by_waiter_id, amount_naira, method, status, is_pretend, paid_at, created_at) FROM stdin;
1	1	4	16000.00	cash	completed	t	2026-08-21 13:30:00+01	2026-09-05 14:40:22.942949+01
2	4	3	5000.00	card	completed	t	2026-08-21 18:38:00+01	2026-09-05 14:40:22.942949+01
3	9	1	4000.00	cash	completed	t	2026-09-06 01:55:28.0077+01	2026-09-06 01:55:28.0077+01
4	7	1	9800.00	cash	completed	t	2026-09-06 01:59:49.092234+01	2026-09-06 01:59:49.092234+01
5	14	25	7500.00	card	completed	t	2026-09-16 02:05:43.503394+01	2026-09-16 02:05:43.503394+01
\.


--
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rating (id, order_id, customer_id, rating_value, comment, submitted_at) FROM stdin;
1	1	1	5	Excellent food and service	2026-08-21 13:35:00+01
2	2	2	1	Service is very slow	2026-08-21 15:59:00+01
3	14	16	5	\N	2026-09-16 02:10:30.46795+01
\.


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.restaurant (id, name, address, phone, created_at) FROM stdin;
1	mekx restuarant	14 Adeola Odeku Street, Victoria Island, Lagos	0700-CHOWLY-1	2026-09-05 14:40:22.942949+01
2	Chowly Lounge	3 Yakubu Gowon Crescent, Asokoro, Abuja	0700-CHOWLY-2	2026-09-05 14:40:22.942949+01
3	Lynn's Kitchen	18 Opebi, Lagos, Nigeria	+234 815 404 8748	2026-09-09 16:08:29.261766+01
\.


--
-- Data for Name: waiter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.waiter (id, restaurant_id, name, phone, shift_schedule, created_at) FROM stdin;
1	1	Ngozi	09021147124	Morning	2026-09-05 14:40:22.942949+01
2	1	Femi	08033040145	Morning	2026-09-05 14:40:22.942949+01
3	1	Ade	07033768721	Evening	2026-09-05 14:40:22.942949+01
4	1	Etuk	09033499214	Morning	2026-09-05 14:40:22.942949+01
5	2	Bisi	08055512345	Evening	2026-09-05 14:40:22.942949+01
6	3	Chinedu Okafor	08012345678	Morning	2026-09-15 22:47:51.984075+01
7	3	Aisha Bello	08023456789	Evening	2026-09-15 22:47:51.984075+01
8	3	Emeka Nwosu	08034567890	Night	2026-09-15 22:47:51.984075+01
9	3	Yemi Adeyemi	08045678901	Morning	2026-09-15 22:47:51.984075+01
10	3	Fatima Abdullahi	08056789012	Evening	2026-09-15 22:47:51.984075+01
11	3	Tunde Balogun	08067890123	Night	2026-09-15 22:47:51.984075+01
12	3	Amaka Eze	08078901234	Morning	2026-09-15 22:47:51.984075+01
13	3	Ibrahim Musa	08089012345	Evening	2026-09-15 22:47:51.984075+01
14	3	Blessing Okoro	08090123456	Night	2026-09-15 22:47:51.984075+01
15	3	Zainab Ibrahim	08011223344	Morning	2026-09-15 22:47:51.984075+01
16	3	Temiloluwa Akinyemi	08122334455	Morning	2026-09-15 22:50:58.828806+01
17	3	Maryam Sani	08133445566	Night	2026-09-15 22:50:58.828806+01
18	3	Chisom Anozie	08144556677	Morning	2026-09-15 22:50:58.828806+01
19	3	Damilola Ogunleye	08155667788	Night	2026-09-15 22:50:58.828806+01
20	3	Esther Wanjiku	08166778899	Morning	2026-09-15 22:50:58.828806+01
21	3	Abdulrahman Garba	08177889900	Night	2026-09-15 22:50:58.828806+01
22	3	Nneka Iloh	08188990011	Morning	2026-09-15 22:50:58.828806+01
23	3	Favour Bassey	08199001122	Night	2026-09-15 22:50:58.828806+01
24	3	Seyi Oladipo	08010112233	Morning	2026-09-15 22:50:58.828806+01
25	3	Hauwa Mohammed	08021223344	Night	2026-09-15 22:50:58.828806+01
\.


--
-- Name: bartender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bartender_id_seq', 13, true);


--
-- Name: chef_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chef_id_seq', 15, true);


--
-- Name: complaint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaint_id_seq', 4, true);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_id_seq', 16, true);


--
-- Name: menu_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_item_id_seq', 65, true);


--
-- Name: order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_item_id_seq', 31, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 14, true);


--
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_id_seq', 5, true);


--
-- Name: rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rating_id_seq', 3, true);


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurant_id_seq', 3, true);


--
-- Name: waiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.waiter_id_seq', 25, true);


--
-- Name: bartender bartender_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bartender
    ADD CONSTRAINT bartender_pkey PRIMARY KEY (id);


--
-- Name: chef chef_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chef
    ADD CONSTRAINT chef_pkey PRIMARY KEY (id);


--
-- Name: complaint complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint
    ADD CONSTRAINT complaint_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: menu_item menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id);


--
-- Name: order_item order_item_order_id_menu_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_menu_item_id_key UNIQUE (order_id, menu_item_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment payment_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_key UNIQUE (order_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: rating rating_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_order_id_key UNIQUE (order_id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- Name: waiter waiter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiter
    ADD CONSTRAINT waiter_pkey PRIMARY KEY (id);


--
-- Name: idx_complaint_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaint_order ON public.complaint USING btree (order_id);


--
-- Name: idx_menu_item_restaurant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_menu_item_restaurant ON public.menu_item USING btree (restaurant_id);


--
-- Name: idx_order_item_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_item_order ON public.order_item USING btree (order_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_restaurant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_restaurant ON public.orders USING btree (restaurant_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_rating_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rating_order ON public.rating USING btree (order_id);


--
-- Name: bartender bartender_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bartender
    ADD CONSTRAINT bartender_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON DELETE CASCADE;


--
-- Name: chef chef_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chef
    ADD CONSTRAINT chef_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON DELETE CASCADE;


--
-- Name: complaint complaint_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint
    ADD CONSTRAINT complaint_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: complaint complaint_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint
    ADD CONSTRAINT complaint_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: complaint complaint_resolved_by_waiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint
    ADD CONSTRAINT complaint_resolved_by_waiter_id_fkey FOREIGN KEY (resolved_by_waiter_id) REFERENCES public.waiter(id);


--
-- Name: menu_item menu_item_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON DELETE CASCADE;


--
-- Name: order_item order_item_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_item(id);


--
-- Name: order_item order_item_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_bartender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_bartender_id_fkey FOREIGN KEY (bartender_id) REFERENCES public.bartender(id);


--
-- Name: orders orders_chef_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_chef_id_fkey FOREIGN KEY (chef_id) REFERENCES public.chef(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: orders orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON DELETE CASCADE;


--
-- Name: orders orders_waiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_waiter_id_fkey FOREIGN KEY (waiter_id) REFERENCES public.waiter(id);


--
-- Name: payment payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payment payment_received_by_waiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_received_by_waiter_id_fkey FOREIGN KEY (received_by_waiter_id) REFERENCES public.waiter(id);


--
-- Name: rating rating_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: rating rating_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: waiter waiter_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiter
    ADD CONSTRAINT waiter_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict mTyAa3TVvmPHSxbr8XgKO5yryoQ4lyV0F7eCYgnAbSFG6HzvquhBToTqPgjJIyH

