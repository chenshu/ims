#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
from datetime import datetime, timedelta
import random
import binascii

class Session(object):

    # 过期时间最小30分钟
    EXPIRED_TIME_MIN_VALUE = 60 * 30
    # 过期时间最大5小时
    EXPIRED_TIME_MAX_VALUE = 60 * 60 * 5
    # 过期默认60分钟
    EXPIRED_TIME_DEFAULT_VALUE = 60 * 60
    # EID更新时间间隔5分钟
    UPDATE_TIME_INTERVAL = 60 * 5

    def __init__(self, secretSid, secretEid, expired):
        self.valid = False
        self.secretSid = secretSid
        self.secretEid = secretEid
        self.expired = expired

        if self.expired < self.__class__.EXPIRED_TIME_MIN_VALUE or self.expired > self.__class__.EXPIRED_TIME_MAX_VALUE:
            self.expired = self.__class__.EXPIRED_TIME_DEFAULT_VALUE

    def encode(self, user_id):
        self.valid = False
        if user_id is None or user_id == 0 or user_id == '':
            return False
        self.user_id = user_id
        # session过期时间
        self.validate_time = time.time() + self.expired
        self.token = random.randint(10000, 99999900)
        self.valid = True
        return True

    def decode(self, sid, eid):
        self.valid = False
        self.sid = sid
        self.eid = eid
        sids = sid.split('-')
        eids = eid.split('-')
        if len(sids) != 3 or len(eids) != 3 or len(sids[1]) == 0 or sids[1] != eids[1]:
            return False
        crc = binascii.crc32('%s%s%s' % (sids[0], sids[1], self.secretSid)) & 0xffffffff
        if str(crc) != sids[2]:
            return False
        crc = binascii.crc32('%s%s%s' % (eids[0], eids[1], self.secretEid)) & 0xffffffff
        if str(crc) != eids[2]:
            return False
        self.validate_time = float(eids[0])
        now = time.time()
        # 是否超时
        if self.validate_time < now < self.validate_time - self.expired:
            return False
        self.valid = True
        self.user_id = int(sids[0])
        self.token = sids[1]
        return True

    def getUid(self):
        if self.valid == False:
            return None
        return self.user_id

    def getSid(self):
        if self.valid == False:
            return None
        crc = binascii.crc32('%s%s%s' % (self.user_id, self.token, self.secretSid)) & 0xffffffff
        sid = '%s-%s-%s' % (self.user_id, self.token, crc)
        return sid

    def getEid(self):
        if self.valid == False:
            return None
        crc = binascii.crc32('%s%s%s' % (str(self.validate_time).split('.')[0], self.token, self.secretEid)) & 0xffffffff
        eid = '%s-%s-%s' % (str(self.validate_time).split('.')[0], self.token, crc)
        return eid

    def updateToken(self):
        now = time.time()
        # 更新eid
        if self.validate_time - self.expired < now < self.validate_time - self.expired + self.__class__.UPDATE_TIME_INTERVAL:
            return False
        self.validate_time = now + self.expired
        return True

if __name__ == '__main__':
    secretSid = 'kdjfoiefwejfdklj02374IY(&TPJGFsdfe'
    secretEid = 'klidofjowehf98&GHOBRkf979H(Phoeor0'
    expired = 1800
    session = Session(secretSid, secretEid, expired)
    uid = 1727
    print session.encode(uid)
    sid = session.getSid()
    eid = session.getEid()
    print session.getUid(), sid, eid
    session = Session(secretSid, secretEid, expired)
    print session.decode(sid, eid)
    print session.getUid()
    print session.updateToken()

