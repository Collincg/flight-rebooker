--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flights; Type: TABLE; Schema: public; Owner: collingraff
--

CREATE TABLE public.flights (
    id character varying NOT NULL,
    airline character varying,
    origin character varying,
    destination character varying,
    departure_time timestamp without time zone,
    arrival_time timestamp without time zone,
    layovers integer,
    status character varying,
    prices jsonb,
    seats_available jsonb
);


ALTER TABLE public.flights OWNER TO collingraff;

--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: collingraff
--

COPY public.flights (id, airline, origin, destination, departure_time, arrival_time, layovers, status, prices, seats_available) FROM stdin;
AA123	American Airlines	JFK	LAX	2025-05-07 08:30:00	2025-05-07 11:45:00	0	canceled	{"first": 1200, "economy": 250, "business": 600}	{"first": 1, "economy": 5, "business": 2}
AA124	American Airlines	JFK	LAX	2025-05-07 13:15:00	2025-05-07 16:30:00	0	on time	{"first": 1150, "economy": 230, "business": 550}	{"first": 0, "economy": 3, "business": 1}
AA171	American Airlines	JFK	LAX	2025-05-07 13:15:00	2025-05-07 19:35:00	0	on time	{"first": 1000, "economy": 220, "business": 500}	{"first": 2, "economy": 5, "business": 1}
AA125	American Airlines	JFK	LAX	2025-05-07 10:00:00	2025-05-07 13:30:00	1	delayed	{"first": 1100, "economy": 240, "business": 580}	{"first": 1, "economy": 4, "business": 2}
DL458	Delta	JFK	LAX	2025-05-07 12:00:00	2025-05-07 15:45:00	0	on time	{"first": 1200, "economy": 260, "business": 600}	{"first": 2, "economy": 6, "business": 3}
UA791	United	JFK	LAX	2025-05-07 16:00:00	2025-05-07 19:30:00	1	delayed	{"first": 1150, "economy": 250, "business": 570}	{"first": 1, "economy": 5, "business": 2}
DL456	Delta	JFK	SFO	2025-05-07 09:00:00	2025-05-07 12:20:00	1	canceled	{"first": 1350, "economy": 300, "business": 700}	{"first": 1, "economy": 0, "business": 2}
DL457	Delta	JFK	SFO	2025-05-07 11:00:00	2025-05-07 14:30:00	0	on time	{"first": 1400, "economy": 310, "business": 690}	{"first": 1, "economy": 7, "business": 4}
UA789	United	JFK	SEA	2025-05-07 10:00:00	2025-05-07 13:50:00	2	delayed	{"first": 1250, "economy": 270, "business": 650}	{"first": 1, "economy": 4, "business": 2}
UA790	United	JFK	SEA	2025-05-07 15:00:00	2025-05-07 18:45:00	1	on time	{"first": 1300, "economy": 260, "business": 600}	{"first": 2, "economy": 8, "business": 3}
SW101	Southwest	LAX	DEN	2025-05-08 14:00:00	2025-05-08 17:30:00	0	on time	{"first": 900, "economy": 190, "business": 400}	{"first": 1, "economy": 10, "business": 3}
SW102	Southwest	LAX	DEN	2025-05-08 18:00:00	2025-05-08 21:30:00	1	on time	{"first": 880, "economy": 180, "business": 420}	{"first": 1, "economy": 9, "business": 2}
BA202	British Airways	LHR	JFK	2025-05-09 10:15:00	2025-05-09 13:45:00	0	canceled	{"first": 2100, "economy": 500, "business": 1200}	{"first": 1, "economy": 2, "business": 1}
BA203	British Airways	LHR	JFK	2025-05-09 16:00:00	2025-05-09 19:30:00	0	on time	{"first": 2000, "economy": 520, "business": 1150}	{"first": 1, "economy": 5, "business": 2}
\.


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: public; Owner: collingraff
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

