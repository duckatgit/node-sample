-- Table: public.insurance_level

CREATE TABLE IF NOT EXISTS public.insurance_level
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "levelName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "levelCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "levelValue" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    "isDeleted" boolean NOT NULL DEFAULT false,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    CONSTRAINT insurance_level_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.insurance_level
    OWNER to postgres;