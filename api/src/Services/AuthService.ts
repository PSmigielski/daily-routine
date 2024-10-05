import "reflect-metadata";
import { scryptSync, timingSafeEqual } from "crypto";
import ApiErrorException from "../Exceptions/ApiErrorException";
import RefreshToken from "../Models/RefreshToken.model";
import User from "../Models/User.model";
import VerifyRequest from "../Models/VerifyRequest.model";
import MailerService from "./MailerService";
import Service from "./Service";
import jwt from "jsonwebtoken";
import IUser from "../Types/IUser";
import ResetPasswordRequest from "../Models/ResetPasswordRequest.model";
import ILoginData from "../Types/ILoginData";
import IIpData from "../Types/IIpData";
import { Inject, Service as ServiceDecorator } from "typedi";

@ServiceDecorator()
class AuthService extends Service {
  public constructor(
    @Inject()
    private mailerService: MailerService,
  ) {
    super();
  }
  public async createAccount(
    email: string,
    login: string,
    password: string,
    countryId: string,
    timezoneId: string,
  ) {
    const user = new User(email, login, password, countryId, timezoneId);
    const data = await user.createUser().catch(this.throwError);
    if (data) {
      const request = await new VerifyRequest(data.id)
        .create()
        .catch(this.throwError);
      if (request) {
        this.mailerService.sendVerificationMail(email, request.id);
        return data;
      }
    }
  }
  private checkPassword(password: string, user: IUser) {
    const [salt, key] = user.password.split(":");
    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(hashedBuffer, keyBuffer);
  }
  public async login({ login, password }: ILoginData, ipData: IIpData) {
    const user = await User.getUserByLogin(login).catch(this.throwError);
    if (!user) {
      throw new ApiErrorException("Wrong credentials", 403);
    }
    if (!user.isVerified) {
      throw new ApiErrorException("user is not verified", 401);
    }
    if (!this.checkPassword(password, user)) {
      throw new ApiErrorException("Wrong credentials", 403);
    }
    const refreshToken = await new RefreshToken(user.id).createToken();
    const token = jwt.sign(
      {
        id: user.id,
        login,
        refTokenId: refreshToken.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: 60 * 15 },
    );
    const tokenData = jwt.decode(token);
    const refreshTokenData = jwt.decode(refreshToken.token);
    if (typeof tokenData != "string" && typeof refreshTokenData != "string") {
      const res = await this.updateLocation(ipData, user.id);
      if (res) {
        return {
          jwt: { token, exp: tokenData?.exp },
          refreshToken: {
            token: refreshToken.token,
            exp: refreshTokenData?.exp,
          },
        };
      }
    }
  }
  public async verify(id: string) {
    const request = await VerifyRequest.getUniqueVerifyRequest(id);
    if (request) {
      User.verify(request.user.id).catch(this.throwError);
      const deletedVerifyRequest = await VerifyRequest.delete(request.id).catch(
        this.throwError,
      );
      return true;
    } else {
      throw new ApiErrorException("request with this id does not exist", 404);
    }
  }
  public async refreshBearerToken(token: string, ipData: IIpData) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded != "string") {
      const refTokens = await RefreshToken.getTokens(decoded.id).catch(
        this.throwError,
      );
      if (refTokens instanceof Object) {
        const refToken = refTokens.find((el) => el.token == token);
        if (refTokens.length === 0 || typeof refToken == "undefined") {
          throw new ApiErrorException("no refresh token found", 401);
        } else {
          const newToken: string = jwt.sign(
            {
              id: decoded.id,
              login: refToken.user?.login,
              refTokenId: refToken?.id,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: 60 * 15 },
          );
          const tokenData = jwt.decode(newToken);
          if (typeof tokenData != "string") {
            const res = await this.updateLocation(
              ipData as IIpData,
              refToken.userId,
            );
            if (res) {
              return { token: newToken, exp: tokenData?.exp };
            }
          }
        }
      }
    }
  }
  public async logout(refTokenId: string, ipData?: IIpData | undefined) {
    const refToken = await RefreshToken.deleteToken(refTokenId);
    if (ipData) {
      const res = await this.updateLocation(ipData, refToken.userId);
      if (res) {
        return true;
      }
    }
    return true;
  }
  public async sendResetRequest(email: string) {
    const user = await User.getUserByEmail(email).catch(this.throwError);
    if (user) {
      const request = await ResetPasswordRequest.create(user.id).catch(
        this.throwError,
      );
      if (request) {
        this.mailerService.sendResetRequest(email, request.id);
        return true;
      }
    } else {
      throw new ApiErrorException("User with this email does not exist!", 404);
    }
  }
  public async resetPassword(newPassword: string, requestId: string) {
    const request = await ResetPasswordRequest.getRequest(requestId).catch(
      this.throwError,
    );
    if (request) {
      const result = await ResetPasswordRequest.removeRequest(requestId).catch(
        this.throwError,
      );
      const updatedUser = await User.updatePassword(
        newPassword,
        request.userId,
      ).catch(this.throwError);
      return true;
    } else {
      return false;
    }
  }
  public async editPassword(
    password: string,
    newPassword: string,
    userId: string,
  ) {
    const user = await User.getUserById(userId).catch(this.throwError);
    if (user) {
      if (!this.checkPassword(password, user)) {
        throw new ApiErrorException("Wrong old password", 403);
      }
      await User.updatePassword(newPassword, userId).catch(this.throwError);
      return true;
    }
  }
  private async updateLocation(ipData: IIpData, userId: string) {
    const user = await User.updateLocation(
      ipData.country as string,
      ipData.timezone as string,
      userId,
    ).catch(this.throwError);
    if (user) {
      return user;
    }
  }
}

export default AuthService;
