import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prismaService: PrismaService){}

    
    async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
        try{
            const bookmark = await this.prismaService.bookmark.create({
                data: {
                    userId,
                    ...createBookmarkDto,
                },
            });
            return bookmark;
        }
        catch (error) {
            throw new ForbiddenException('Error creating bookmark');
        }
    }

    async getBookmarksByUser(userId : number){
        try{
            const bookmarks = await this.prismaService.bookmark.findMany({
                where: {
                    userId,
                },
            });
            if(!bookmarks)  return [];
            return bookmarks;
        }
        catch (error) {
            throw new ForbiddenException('Error fetching bookmarks');
        }      
    }
    
    async getBookmarksById(userId : number, id: number){
        try{
            const bookmark = await this.prismaService.bookmark.findUnique({
                where: {
                    id,
                    userId,
                },
            });
            if(!bookmark)  return [];
            return bookmark;
        }
        catch (error) {
            throw new ForbiddenException('Error fetching bookmark');
        }
            
    }

    async editBookmarkById(userId : number, bookmarkId: number, editBookMarkDto: EditBookmarkDto){
        try{
            const editedBookmark = await this.prismaService.bookmark.update({
                where: {
                    id: bookmarkId,
                    userId,
                },
                data: {
                    ...editBookMarkDto,
                },
            });
            return editedBookmark;
        }
        catch (error) {
            throw new ForbiddenException('Error editing bookmark');
        }
            
    }

    async deleteBookmarkById(userId : number, bookmarkId: number){
        try{
            const deletedBookmark = await this.prismaService.bookmark.delete({
                where: {
                    id: bookmarkId,
                    userId,
                },
            });
            if(!deletedBookmark)  return [];
            return deletedBookmark;
        }
        catch (error) {
            throw new ForbiddenException('Error deleting bookmark');
        }
    }
}
