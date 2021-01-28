/* -- create db
 CREATE ROLE username WITH LOGIN PASSWORD 'password';
 ALTER ROLE username CREATEDB;
 CREATE DATABASE dbname;
 GRANT ALL PRIVILEGES ON DATABASE dbname TO username;
 */
-- user name
-- user primary mail
-- user password
create table "user" (
    name varchar(30),
    email varchar(30) primary key,
    password varchar(50)
);

alter table "user" add company_reg bool default false not null;
alter table "user" alter column password type varchar(255) using password::varchar(255);

-- add user phone number after registered
-- add user address after registered
alter table "user" add address varchar(255);
alter table "user" add phone bigint;

-- company or business name
create table "user_company" (
                                c_name varchar(30),
                                c_email varchar(30) primary key,
                                c_address varchar(255),
                                c_phone bigint,
                                c_user varchar(30),
                                foreign key (c_user) references "user"(email) on delete cascade
);


-- type_name = print newspaper, digital ads over own website
create table ad_types (
                          type_id varchar(10) primary key,
                          type_name varchar(30)
);


-- ad_type = print ads, digital ads
-- ad_location = local, national
create table ads (
    ad_id serial not null primary key,
    ad_type varchar(10),
    ad_company varchar(30) not null,
    ad_user varchar(30) not null,
    ad_location varchar(30),
    foreign key (ad_type) references ad_types (type_id),
    foreign key (ad_company) references "user_company"(c_email),
    foreign key (ad_user) references "user"(email)
);

-- adv id = company name + num
-- adv_title = title of ad
-- adv_desc = description of ad
-- adv_contents = url for ad content
-- alter table ad_content add adv_type varchar(10)
create table ad_content (
    adv_id varchar(10) primary key,
    adv_user varchar(30),
    adv_title varchar(100),
    adv_desc text,
    adv_type varchar(10),
    foreign key (adv_type) references ad_types (type_id),
    foreign key (adv_user) references "user" (email)
);

create table orders (
    order_id int primary key,
    order_user varchar(30),
    order_ad_id int,
    order_type_id varchar(10),
    order_time timestamp,
    order_amount bigint,
    order_status varchar(20),
    foreign key (order_user) references "user"(email),
    foreign key (order_type_id) references ad_types(type_id),
    foreign key (order_ad_id) references ads (ad_id)
);


insert into ad_types values ('WEB','Advertisements on Websites');
insert into ad_types values ('APP','Advertisements on Mobile Apps');
insert into ad_types values ('PRINT','Advertisements on Printings');
insert into ad_types values ('NEWS','Advertisements on Newspapers');

-- insert into ads (ad_type, ad_company, ad_user, ad_location) values ('WEB', 'oh@oh.oh', 'a@a.a', 'local')


-- insert into ad_content values ('ADU001', 'a@a.a', 'Test advt', 'this is a test advertisement');
