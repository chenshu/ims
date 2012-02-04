#!/usr/bin/env python
# -*- coding: utf-8 -*-

import string
import random
import hashlib

class UserPassword(object):

    def generate_salt(self, cnt):
        salt = list()
        seed = '%s%s' % (string.digits, string.letters)
        for i in range(cnt):
            salt.append(random.choice(seed))
        return ''.join(salt)

    def generate_hash(self, password, salt):
        return hashlib.sha512('%s%s' % (password, salt)).hexdigest()

if __name__ == '__main__':
    generator = UserPassword()
    salt = generator.generate_salt(64)
    print salt
    print generator.generate_hash('chenshu', salt)
