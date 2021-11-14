import { PrismaClient } from ".prisma/client";

class Model {
    private prisma: PrismaClient = new PrismaClient();
    protected getPrisma() {
        return this.prisma;
    }
}

export default Model;