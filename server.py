#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os.path
import tornado.database
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
from tornado.options import define, options
from tornado.escape import json_encode, json_decode
from secret import UserPassword
from session import Session
import time
from datetime import datetime, timedelta

define("port", default=8888, help="run on the given port", type=int)
define("mysql_host", default="127.0.0.1:3306", help="database host")
define("mysql_database", default="ims", help="database name")
define("mysql_user", default="chenshu", help="database user")
define("mysql_password", default="chenshu", help="database password")

class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        return self.application.db

    def get_current_user(self):
        sid = self.get_secure_cookie("sid")
        eid = self.get_secure_cookie("eid")
        # 没有登录
        if not sid or not eid:
            return None
        session = Session(self.settings["session_secretSid"], self.settings["session_secretEid"], self.settings["session_expired"])
        # 登录超时
        if session.decode(sid, eid) is False:
            return None
        user_id = session.getUid()
        user = self.db.get("SELECT * FROM accounts WHERE id = %s", int(user_id))
        # 帐户是否合法
        if user is None or ("status" in user and user["status"] == 0):
            return None
        # 是否需要更新EID
        if session.updateToken():
            eid = session.getEid()
            self.set_secure_cookie("eid", eid, None)
        return user

    def get_current_path(self):
        old = ''
        paths = []
        for path in self.request.uri.split('/'):
            if old == path:
                continue
            url = "%s/%s" % (old, path)
            name = ''
            if url == '/':
                name = '首页'
            elif url == '/business':
                name = '部门业务'
            elif url == '/business/imposition':
                name = '征收事业部'
            elif url == '/business/imposition/database':
                name = 'xxx'
            paths.append({'url' : url, 'name' : name})
            old = path
        return paths

class AuthSignUpHandler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.render("signup.html", error_messages=None)
            return
        self.redirect(self.get_argument("next", "/"))

    def post(self):
        username = self.get_argument("username", "")
        password = self.get_argument("password", "")
        password_confirm = self.get_argument("password_confirm", "")
        error_messages = list()
        if username == "" or password == "" or password_confirm == "":
            error_messages.append("参数不能为空")
            self.render("signup.html", error_messages=error_messages)
            return
        if not username.encode("utf-8").isalnum() or not password.encode("utf-8").isalnum():
            error_messages.append("参数不能包含数字和字母以外的字符")
            self.render("signup.html", error_messages=error_messages)
            return
        if len(password) < 8:
            error_messages.append("密码不能小于8位")
            self.render("signup.html", error_messages=error_messages)
            return
        if password != password_confirm:
            error_messages.append("两次密码输入不一致")
            self.render("signup.html", error_messages=error_messages)
            return
        password_generator = UserPassword()
        password_salt = password_generator.generate_salt(64)
        password_hash = password_generator.generate_hash(password, password_salt)
        status = 0
        self.db.execute(
            "INSERT INTO accounts (username, password_hash, password_salt, status,"
            "created) VALUES (%s,%s,%s,%s,UTC_TIMESTAMP())",
            username, password_hash, password_salt, status)
        self.redirect(self.get_argument("next", "/"))

class AuthLoginHandler(BaseHandler):
    def get(self):
        if not self.current_user:
            self.render("login.html", error_messages=None, username="")
            return
        self.redirect(self.get_argument("next", "/"))

    def post(self):
        username = self.get_argument("username", "")
        password = self.get_argument("password", "")
        error_messages = list()
        if username == "" or password == "":
            error_messages.append("参数不能为空")
            self.render("login.html", error_messages=error_messages, username="")
            return
        user = self.db.get("SELECT * FROM accounts WHERE username = %s", username)
        if user is None:
            error_messages.append("用户名密码错误")
            self.render("login.html", error_messages=error_messages, username=username)
            return
        if user["status"] == 0:
            error_messages.append("帐户没有开通")
            self.render("login.html", error_messages=error_messages, username=username)
            return
        password_generator = UserPassword()
        password_hash = password_generator.generate_hash(password, user["password_salt"])
        if password_hash != user["password_hash"]:
            error_messages.append("用户名密码错误")
            self.render("login.html", error_messages=error_messages, username=username)
            return
        session = Session(self.settings["session_secretSid"], self.settings["session_secretEid"], self.settings["session_expired"])
        if session.encode(user["id"]) is False:
            error_messages.append("用户数据错误")
            self.render("login.html", error_messages=error_messages, username=username)
            return
        sid = session.getSid()
        eid = session.getEid()
        self.set_secure_cookie("sid", sid, None)
        self.set_secure_cookie("eid", eid, None)
        self.redirect(self.get_argument("next", "/"))

class AuthLogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("sid")
        self.clear_cookie("eid")
        self.redirect(self.get_argument("next", "/"))

class HomeHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        #entries = self.db.query("SELECT * FROM entries ORDER BY published "
        #                        "DESC LIMIT 5")
        #if not entries:
        #    self.redirect("/compose")
        #    return
        #self.render("home.html", entries=list())
        name = tornado.escape.xhtml_escape(self.current_user["username"])
        self.render("home.html", name=name, paths=self.get_current_path())

class BusinessHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("business.html", paths=self.get_current_path())

class BusinessImpositionHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("imposition.html", paths=self.get_current_path())

class BusinessImpositionProjectHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        pass

class BusinessImpositionDatabaseHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        pass

class BusinessImpositionDatabaseDetailHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, datatype):
        table = self.get_argument("t", None)
        if table is None or table not in ( \
                'building_basic_price', \
                'building_towards_correction', \
                'building_roof_type_correction', \
                'building_additional_price', \
                'building_volume_ratio', \
                'building_floor_correction'):
            raise tornado.web.HTTPError(400)
        if datatype == 'bungalow':
            pass
        elif datatype == 'building':
            data = self.db.query("SELECT * FROM %s" % (table))
            self.render("%s.html" % (table), data=data)
        elif datatype == 'tree':
            pass
        elif datatpe == 'attachment':
            pass
        else:
            pass

class BusinessImpositionDatabaseDetailOperationHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, operation):
        table = self.get_argument("t", None)
        if table is None or table not in ( \
                'building_basic_price', \
                'building_towards_correction', \
                'building_roof_type_correction', \
                'building_additional_price', \
                'building_volume_ratio', \
                'building_floor_correction'):
            raise tornado.web.HTTPError(400)
        if operation == 'add':
            if table == 'building_basic_price':
                product_type = self.get_argument('product_type', None)
                product_structure = self.get_argument('product_structure', None)
                product_price = self.get_argument('product_price', None)
                product_classify = self.get_argument('product_classify', None)
                if product_type == 'residential':
                    product_type = u'住宅'
                elif product_type == 'nonresidential':
                    product_type = u'非住宅'
                else:
                    product_type = None
                if product_type is None or \
                        product_structure is None or \
                        product_price is None or \
                        product_classify is None:
                    raise tornado.web.HTTPError(400)
                sql = "INSERT INTO building_basic_price (product_type, product_structure, product_price, product_classify) VALUES (%s, %s, %s, %s)"
                lastid = self.db.execute(sql, product_type, product_structure, float(product_price), product_classify)
                self.write(json_encode({'action' : 'success', 'data' : [lastid, product_type, product_structure, product_price, product_classify]}))
            elif table == 'building_towards_correction':
                towards = self.get_argument('towards', None)
                correction_factor = self.get_argument('correction_factor', None)
                if towards == 'east':
                    towards = u'东'
                elif towards == 'south':
                    towards = u'南'
                elif towards == 'west':
                    towards = u'西'
                elif towards == 'north':
                    towards = u'北'
                else:
                    towards = None
                if towards is None or \
                        correction_factor is None:
                    raise tornado.web.HTTPError(400)
                sql = "INSERT INTO building_towards_correction (towards, correction_factor) VALUES (%s, %s)"
                lastid = self.db.execute(sql, towards, float(correction_factor))
                self.write(json_encode({'action' : 'success', 'data' : [lastid, towards, correction_factor]}))
            elif table == 'building_roof_type_correction':
                roof_type = self.get_argument('roof_type', None)
                correction_factor = self.get_argument('correction_factor', None)
                if roof_type is None or \
                        correction_factor is None:
                    raise tornado.web.HTTPError(400)
                sql = "INSERT INTO building_roof_type_correction (roof_type, correction_factor) VALUES (%s, %s)"
                lastid = self.db.execute(sql, roof_type, float(correction_factor))
                self.write(json_encode({'action' : 'success', 'data' : [lastid, roof_type, correction_factor]}))
            elif table == 'building_additional_price':
                additional = self.get_argument('additional', None)
                price = self.get_argument('price', None)
                if additional is None or \
                        price is None:
                    raise tornado.web.HTTPError(400)
                sql = "INSERT INTO building_additional_price (additional, price) VALUES (%s, %s)"
                lastid = self.db.execute(sql, additional, float(price))
                self.write(json_encode({'action' : 'success', 'data' : [lastid, additional, price]}))
            elif table == 'building_volume_ratio':
                volume = self.get_argument('volume', None)
                correction_factor = self.get_argument('correction_factor', None)
                product_type = self.get_argument('product_type', None)
                if product_type == 'residential':
                    product_type = u'住宅'
                elif product_type == 'nonresidential':
                    product_type = u'非住宅'
                else:
                    product_type = None
                if volume is None or \
                        correction_factor is None or \
                        product_type is None:
                    raise tornado.web.HTTPError(400)
                sql = "INSERT INTO building_volume_ratio (volume, correction_factor, product_type) VALUES (%s, %s, %s)"
                lastid = self.db.execute(sql, volume, float(correction_factor), product_type)
                self.write(json_encode({'action' : 'success', 'data' : [lastid, volume, correction_factor, product_type]}))
            else:
                raise tornado.web.HTTPError(400)
        elif operation == 'update':
            if table == 'building_basic_price':
                item_id = self.get_argument('id', None)
                column = self.get_argument('column', None)
                value = self.get_argument('value', None)
                if column == 'product_type' and (value == 'residential' or value == 'nonresidential'):
                    if value == 'residential':
                        value = u'住宅'
                    elif value == 'nonresidential':
                        value = u'非住宅'
                    sql = "UPDATE building_basic_price SET product_type = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                elif column in ('product_structure', 'product_price', 'product_classify'):
                    sql = "UPDATE building_basic_price SET " + column + " = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table =='building_towards_correction':
                item_id = self.get_argument('id', None)
                column = self.get_argument('column', None)
                value = self.get_argument('value', None)
                if column == 'towards' and (value == 'east' or value == 'south' or value == 'west' or value == 'north'):
                    if value == 'east':
                        value = u'东'
                    elif value == 'south':
                        value = u'南'
                    elif value == 'west':
                        value = u'西'
                    elif value == 'north':
                        value = u'北'
                    sql = "UPDATE building_towards_correction SET towards = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                elif column in ('correction_factor'):
                    sql = "UPDATE building_towards_correction SET " + column + " = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_roof_type_correction':
                item_id = self.get_argument('id', None)
                column = self.get_argument('column', None)
                value = self.get_argument('value', None)
                if column in ('roof_type', 'correction_factor'):
                    sql = "UPDATE building_roof_type_correction SET " + column + " = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_additional_price':
                item_id = self.get_argument('id', None)
                column = self.get_argument('column', None)
                value = self.get_argument('value', None)
                if column in ('additional', 'price'):
                    sql = "UPDATE building_additional_price SET " + column + " = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_volume_ratio':
                item_id = self.get_argument('id', None)
                column = self.get_argument('column', None)
                value = self.get_argument('value', None)
                if column == 'product_type' and (value == 'residential' or value == 'nonresidential'):
                    if value == 'residential':
                        value = u'住宅'
                    elif value == 'nonresidential':
                        value = u'非住宅'
                    sql = "UPDATE building_volume_ratio SET product_type = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                elif column in ('volume', 'correction_factor'):
                    sql = "UPDATE building_volume_ratio SET " + column + " = %s where id = %s"
                    self.db.execute(sql, value, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            else:
                raise tornado.web.HTTPError(400)
        elif operation == 'delete':
            if table == 'building_basic_price':
                item_id = self.get_argument('id', None)
                if item_id is not None:
                    sql = "DELETE FROM building_basic_price WHERE id = %s"
                    self.db.execute(sql, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_towards_correction':
                item_id = self.get_argument('id', None)
                if item_id is not None:
                    sql = "DELETE FROM building_towards_correction WHERE id = %s"
                    self.db.execute(sql, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_roof_type_correction':
                item_id = self.get_argument('id', None)
                if item_id is not None:
                    sql = "DELETE FROM building_roof_type_correction WHERE id = %s"
                    self.db.execute(sql, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_additional_price':
                item_id = self.get_argument('id', None)
                if item_id is not None:
                    sql = "DELETE FROM building_additional_price WHERE id = %s"
                    self.db.execute(sql, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            elif table == 'building_volume_ratio':
                item_id = self.get_argument('id', None)
                if item_id is not None:
                    sql = "DELETE FROM building_volume_ratio WHERE id = %s"
                    self.db.execute(sql, item_id)
                    self.write(json_encode({'action' : 'success'}))
                else:
                    raise tornado.web.HTTPError(400)
            else:
                raise tornado.web.HTTPError(400)
        else:
            raise tornado.web.HTTPError(400)

class CalculateDataHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        table = 'calculate_data'
        data = self.db.query("SELECT * FROM %s" % (table))
        self.render("%s.html" % (table), data=data)

class Application(tornado.web.Application):
    def __init__(self):
        settings = dict(
            title=u"信息管理系统",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            #ui_modules={"Entry": EntryModule},
            xsrf_cookies=True,
            cookie_secret="11oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
            login_url="/auth/login",
            autoescape=None,
            debug=True,
            session_secretSid = "kdfiek028&Gkk;/d9eybfklkdGYRVl;dfjkdkfk9^Tgjk",
            session_secretEid = "ds@#4e4rY^7uM,(0?hyydhdjjy^%$F4xHY65HI86hgr$#",
            session_expired = 1800,
        )
        handlers = [
            (r"/", HomeHandler),
            #(r"/archive", ArchiveHandler),
            #(r"/feed", FeedHandler),
            #(r"/entry/([^/]+)", EntryHandler),
            #(r"/compose", ComposeHandler),
            (r"/auth/login", AuthLoginHandler),
            (r"/auth/logout", AuthLogoutHandler),
            (r"/auth/signup", AuthSignUpHandler),
            (r"/business", BusinessHandler),
            (r"/business/imposition", BusinessImpositionHandler),
            (r"/business/imposition/project", BusinessImpositionProjectHandler),
            (r"/business/imposition/database", BusinessImpositionDatabaseHandler),
            (r"/business/imposition/database/([^/]+)", BusinessImpositionDatabaseDetailHandler),
            (r"/business/imposition/database/building/([^/]+)", BusinessImpositionDatabaseDetailOperationHandler),
            (r"/project", CalculateDataHandler),
        ]
        tornado.web.Application.__init__(self, handlers, **settings)

        # Have one global connection to the blog DB across all handlers
        self.db = tornado.database.Connection(
            host=options.mysql_host, database=options.mysql_database,
            user=options.mysql_user, password=options.mysql_password)

def main():
    http_server = tornado.httpserver.HTTPServer(Application())
    tornado.options.parse_command_line()
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
