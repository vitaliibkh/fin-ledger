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


CREATE TABLE public.account (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(20) NOT NULL,
    currency_id integer NOT NULL,
    parent_id integer,
    balance numeric(15,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;



CREATE TABLE public.cash_flow_category (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    parent_id integer,
    is_active boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE public.cash_flow_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.cash_flow_category_id_seq OWNED BY public.cash_flow_category.id;



CREATE TABLE public.counterparty (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    tax_code character varying(20),
    contact_info character varying(255),
    is_active boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE public.counterparty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.counterparty_id_seq OWNED BY public.counterparty.id;



CREATE TABLE public.currency (
    id integer NOT NULL,
    code character varying(3) NOT NULL,
    name character varying(50) NOT NULL
);



CREATE SEQUENCE public.currency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.currency_id_seq OWNED BY public.currency.id;



CREATE TABLE public.exchange_rate (
    currency_id integer NOT NULL,
    rate_date date NOT NULL,
    multiplier numeric(10,4) NOT NULL
);



CREATE TABLE public.journal_entry (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    amount numeric(15,2) NOT NULL,
    debit_account_id integer NOT NULL,
    credit_account_id integer NOT NULL,
    category_id integer NOT NULL,
    counterparty_id integer,
    user_id integer NOT NULL,
    status character varying(20) DEFAULT 'Completed'::character varying NOT NULL,
    comment character varying(255)
);



CREATE SEQUENCE public.journal_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.journal_entry_id_seq OWNED BY public.journal_entry.id;



CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255)
);



CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;



CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id integer NOT NULL,
    email character varying(100),
    is_active boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;



ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);



ALTER TABLE ONLY public.cash_flow_category ALTER COLUMN id SET DEFAULT nextval('public.cash_flow_category_id_seq'::regclass);



ALTER TABLE ONLY public.counterparty ALTER COLUMN id SET DEFAULT nextval('public.counterparty_id_seq'::regclass);



ALTER TABLE ONLY public.currency ALTER COLUMN id SET DEFAULT nextval('public.currency_id_seq'::regclass);



ALTER TABLE ONLY public.journal_entry ALTER COLUMN id SET DEFAULT nextval('public.journal_entry_id_seq'::regclass);



ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);



ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);



ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_code_key UNIQUE (code);



ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.cash_flow_category
    ADD CONSTRAINT cash_flow_category_pkey PRIMARY KEY (id);



ALTER TABLE public.account
    ADD CONSTRAINT chk_account_type CHECK (((type)::text = ANY ((ARRAY['Active'::character varying, 'Passive'::character varying, 'Active-Passive'::character varying])::text[]))) NOT VALID;



ALTER TABLE public.journal_entry
    ADD CONSTRAINT chk_entry_status CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Completed'::character varying, 'Reversed'::character varying, 'Cancelled'::character varying])::text[]))) NOT VALID;



ALTER TABLE ONLY public.counterparty
    ADD CONSTRAINT counterparty_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_code_key UNIQUE (code);



ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.exchange_rate
    ADD CONSTRAINT exchange_rate_pkey PRIMARY KEY (currency_id, rate_date);



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);



ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;



ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.account(id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;



ALTER TABLE ONLY public.cash_flow_category
    ADD CONSTRAINT cash_flow_category_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.cash_flow_category(id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;



ALTER TABLE ONLY public.exchange_rate
    ADD CONSTRAINT exchange_rate_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.cash_flow_category(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_counterparty_id_fkey FOREIGN KEY (counterparty_id) REFERENCES public.counterparty(id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_credit_account_id_fkey FOREIGN KEY (credit_account_id) REFERENCES public.account(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_debit_account_id_fkey FOREIGN KEY (debit_account_id) REFERENCES public.account(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;



ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;



ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
