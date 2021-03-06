# -*- coding: utf-8 -*-
from backends.services.exceptions import UserNotExistError
from www.models import Users


class UserRepo(object):

    def get_user_by_user_id(self, user_id):
        u = Users.objects.filter(user_id=user_id)
        if not u:
            raise UserNotExistError("用户{}不存在".format(user_id))
        return u[0]

    def get_user_by_username(self, user_name):
        users = Users.objects.filter(nick_name=user_name)
        if not users:
            raise UserNotExistError("用户{}不存在".format(user_name))
        return users[0]

    def get_user_by_filter(self, args=None, kwargs=None):
        args = tuple(args) if isinstance(args, (tuple, list, set)) else tuple()
        kwargs = kwargs if isinstance(kwargs, dict) else dict()
        users = Users.objects.filter(*args, **kwargs)
        return users

    def get_by_user_id(self, user_id):
        u = Users.objects.filter(user_id=user_id)
        if u:
            return u[0]
        return None


user_repo = UserRepo()
